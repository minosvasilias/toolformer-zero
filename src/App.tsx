import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Alert, AlertTitle, Grid, Link, ThemeProvider } from "@mui/material";
import {
	prompt_template,
	google_url,
	max_search_results,
	theme,
	math,
} from "./Constants";
import {
	CompletionItem,
	CompletionType,
	ToolType,
	getToolType,
	getToolInput,
} from "./CompletionItem";
import { CompletionElement } from "./CompletionElement";
import { PromptInput } from "./PromptInput";
import { alertStyle, githubLinkStyle, rootGridStyle } from "./MuiStyles";
import Cookies from "universal-cookie";
import { Setup } from "./Setup";

function App() {
	const [setupCompleted, setSetupCompleted] = useState(false);
	const [requestActive, setRequestActive] = useState(false);
	const [completion, setCompletion] = useState<Array<CompletionItem>>([]);
	const [toast, setToast] = useState("");
	const [openaiApiKey, setOpenaiApiKey] = useState("");
	const [googleAppId, setGoogleAppId] = useState("");
	const [googleApiKey, setGoogleApiKey] = useState("");

	var rawCompletion = "";
	var newCompletion = "";
	var curCompletion: Array<CompletionItem> = [];

	useEffect(() => {
		if (!setupCompleted) {
			getCookies();
		}
	}, []);

	function completeSetup(
		_openaiApiKey: string,
		_googleAppId: string,
		_googleApiKey: string,
		wasUserInput: boolean
	) {
		if (_openaiApiKey.length != 51)
			return showErrorToast("No valid OpenAI API key set.", wasUserInput);
		if (_googleAppId.length != 17)
			return showErrorToast("No valid Google App ID set.", wasUserInput);
		if (_googleApiKey.length != 39)
			return showErrorToast("No valid Google API key set.", wasUserInput);
		setOpenaiApiKey(_openaiApiKey);
		setGoogleAppId(_googleAppId);
		setGoogleApiKey(_googleApiKey);
		if (wasUserInput) setCookies();
		setSetupCompleted(true);
	}

	function showErrorToast(msg: string, wasUserInput: boolean) {
		if (!wasUserInput) return false;
		setToast(msg);
		new Promise((f) =>
			setTimeout(() => {
				setToast("");
			}, 5000)
		);
		return false;
	}

	function getCookies() {
		const cookies = new Cookies();
		completeSetup(
			cookies.get("openaiApiKey") ?? "",
			cookies.get("googleAppId") ?? "",
			cookies.get("googleApiKey") ?? "",
			false
		);
	}

	function setCookies() {
		const cookies = new Cookies();
		cookies.set("openaiApiKey", openaiApiKey, {
			path: "/",
		});
		cookies.set("googleAppId", googleAppId, {
			path: "/",
		});
		cookies.set("googleApiKey", googleApiKey, {
			path: "/",
		});
	}

	async function sendPrompt(prompt: string) {
		//Injects user prompt into template and requests completion
		if (requestActive) return;
		//Reset all completion data
		curCompletion = [];
		rawCompletion = "";
		newCompletion = "";
		setRequestActive(true);
		//Inject prompt into template and get completion
		const final_prompt = prompt_template
			.replace("DATE_TODAY", new Date().toDateString())
			.replace("USER_INPUT", prompt);
		getCompletion(final_prompt);
	}

	async function getCompletion(final_prompt: string) {
		//Stream completion from OpenAI
		var es = await fetch("https://api.openai.com/v1/completions", {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + openaiApiKey,
			},
			method: "POST",
			body: JSON.stringify({
				model: "text-davinci-003",
				prompt: final_prompt,
				temperature: 0.7,
				max_tokens: 500,
				stream: true,
			}),
		});
		const reader = es.body?.pipeThrough(new TextDecoderStream()).getReader();
		if (!reader) return;

		//Update raw completion to include prompt
		//(important to continue streams after tool evaluation)
		rawCompletion = final_prompt;

		//Stream completion either until a tool was used or the completion has ended
		let toolUsed = false;
		while (!toolUsed) {
			const res = await reader?.read();
			toolUsed = await readCompletionStream(res);
			if (res?.done) break;
		}

		//Allow next request, update UI
		setRequestActive(toolUsed);
	}

	async function readCompletionStream(res: ReadableStreamReadResult<string>) {
		//Parse OpenAI response
		//Multiple JSON responses may be received in one execution of reader.read()
		//We therefore sanitize the raw response and then split on newlines
		const raw_json = res?.value?.replaceAll("data:", "").trim() ?? "";
		const split_json = raw_json.split("\n");
		let toolUsed = false;
		//Attempt to parse each received JSON object
		split_json.every((json_string) => {
			json_string = json_string.trim();
			if (json_string.length > 0) {
				try {
					const json = JSON.parse(json_string);
					//Get completion token(s) received
					let token: string = json.choices[0].text;
					//Trim start of completion to avoid ugly whitespace
					if (newCompletion.length == 0) token = token.trimStart();
					//Amend completion data
					rawCompletion += token;
					newCompletion += token;
					//Parse current completion
					toolUsed = parseCompletion();
				} catch (ex) {
					//If exception is not caused by OpenAI [DONE] payload, throw error
					if (json_string.indexOf("[DONE]") == -1) {
						addError();
						console.error(ex);
					}
				}
			}
			//Break out of every() if tool was used
			return !toolUsed;
		});
		return toolUsed;
	}

	function parseCompletion() {
		let toolUsed = false;
		//Match for tools
		let matches = newCompletion.match(/([[])\S.+?(->)/g);
		if (matches) {
			//If matches exist, strip out non-tool string and complete existing item if exists
			let preToolString = newCompletion.replace(matches[0], "");
			amendDefaultItem(preToolString, true);
			//Add completion item for found tool
			let toolItem = addCompletionItem(matches[0], CompletionType.TOOL);
			//Reset newCompletion string once tool has been added
			newCompletion = "";
			//Evaluate and cancel stream
			evaluateTool(toolItem);
			toolUsed = true;
		} else {
			//If no matches exist, we are just streaming a normal completion
			//We make sure to only show characters up to a potential [
			let split = newCompletion.split("[");
			amendDefaultItem(split[0], false);
		}
		//For each completed parse, we update the state to trigger a re-render
		setCompletion([...curCompletion]);
		return toolUsed;
	}

	function addCompletionItem(
		text: string,
		type: CompletionType,
		completed = false
	) {
		//Add a completion item to the current stack
		let toolItem: CompletionItem = {
			text: text,
			type: type,
			toolType: type == CompletionType.TOOL ? getToolType(text) : undefined,
			completed: completed,
		};
		curCompletion.push(toolItem);
		return toolItem;
	}

	function amendDefaultItem(text: string, complete: boolean) {
		//Amend the last default completion item if it exists, otherwise add to stack
		let lastCompletion = curCompletion[curCompletion.length - 1];
		if (lastCompletion && lastCompletion.type == CompletionType.DEFAULT) {
			curCompletion[curCompletion.length - 1].text = text;
			curCompletion[curCompletion.length - 1].completed = complete;
		} else {
			addCompletionItem(text, CompletionType.DEFAULT, true);
		}
	}

	function addError() {
		setRequestActive(false);
		addCompletionItem(" An error occurred. :( ", CompletionType.ERROR, true);
		setCompletion(curCompletion);
	}

	async function evaluateTool(completionItem: CompletionItem) {
		//Evaluate tool completion item
		switch (completionItem.toolType) {
			case ToolType.MATH:
				try {
					let result = math.evaluate(getToolInput(completionItem));
					let resultString = result.toString();
					//Slightly delay local tool execution for dramatic effect
					setTimeout(function () {
						setToolResult(resultString, completionItem);
					}, 500);
				} catch (ex) {
					addError();
					console.error(ex);
				}
				return;

			case ToolType.NOW:
				let dateString = new Date().toLocaleString();
				//Slightly delay local tool execution for dramatic effect
				setTimeout(function () {
					setToolResult(dateString, completionItem);
				}, 500);
				return;

			case ToolType.SEARCH:
				searchGoogle(getToolInput(completionItem), completionItem);
				return;
		}
	}

	function setToolResult(resultString: string, lastCompletion: CompletionItem) {
		//Add tool result to last completion item, then continue completion stream
		resultString += "]";
		lastCompletion.text += resultString;
		lastCompletion.completed = true;
		getCompletion(rawCompletion + resultString);
	}

	async function searchGoogle(query: string, lastCompletion: CompletionItem) {
		//Fetch result from Google Search API
		let url =
			google_url
				.replace("APP_ID", googleAppId)
				.replace("API_KEY", googleApiKey) + encodeURI(query);
		await fetch(url, {
			method: "GET",
		})
			.then((response) => response.json())
			.then((data) => {
				let resultString = "";
				//Add max_search_results items to tool result string
				const max = Math.min(max_search_results, data.items.length);
				data.items.forEach((item: any, index: number) => {
					if (index < max) {
						resultString += item.snippet;
						//Separate individual results with " - "
						if (index < max - 1) {
							resultString += " - ";
						}
					}
				});
				//Sanitize search result to avoid faulty tool parsing
				setToolResult(resultString.replace("]", ""), lastCompletion);
			})
			.catch((error) => {
				addError();
				console.error(error);
			});
	}

	return (
		<ThemeProvider theme={theme}>
			<Grid
				container
				spacing={0}
				direction={setupCompleted ? "column" : "row"}
				alignItems="center"
				justifyContent="center"
				sx={rootGridStyle}
			>
				<img src={logo} width={"600px"}></img>
				{setupCompleted ? (
					<PromptInput
						sendPrompt={sendPrompt}
						completionReceived={completion.length > 0}
						requestActive={requestActive}
					></PromptInput>
				) : (
					<Setup completeSetup={completeSetup}></Setup>
				)}

				<div className="Completion-Parent">
					{completion.map((item, index) => (
						<CompletionElement completion={item}></CompletionElement>
					))}
				</div>
				{toast.length != 0 && (
					<Alert severity="error" sx={alertStyle}>
						<AlertTitle>Error</AlertTitle>
						{toast}
					</Alert>
				)}
				<Link
					underline={"none"}
					color={"#00000077"}
					href={"https://github.com/minosvasilias"}
					variant={"caption"}
					target={"_blank"}
					sx={githubLinkStyle}
				>
					Created by Markus Sobkowski
				</Link>
			</Grid>
		</ThemeProvider>
	);
}

export default App;
