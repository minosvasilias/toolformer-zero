import { useEffect, useRef, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
	Alert,
	AlertTitle,
	Grid,
	IconButton,
	Link,
	ThemeProvider,
} from "@mui/material";
import { prompt_template, theme } from "./Constants";
import { CompletionItem, CompletionType, getToolInput } from "./CompletionItem";
import { CompletionElement } from "./CompletionElement";
import { PromptInput } from "./PromptInput";
import {
	alertStyle,
	githubLinkStyle,
	rootGridStyle,
	toolButtonStyle,
} from "./MuiStyles";
import { Tool } from "./tools/base/Tool";
import { ToolSetup } from "./ToolSetup";
import { Setup } from "./Setup";
import ConstructionIcon from "@mui/icons-material/Construction";
import {
	getActiveToolNames,
	getToolParam,
	getToolParams,
	getWindowAiActive,
	storeWindowAiActive,
} from "./Cookies";
import { allTools } from "./tools/base/AllTools";
import { getWindowAICompletion } from "./WindowAi";
import { getOpenAiCompletion } from "./OpenAi";

function App() {
	const [setupCompleted, setSetupCompleted] = useState<boolean | undefined>(
		undefined
	);
	const [toolSetupActive, setToolSetupActive] = useState(false);
	const [requestActive, setRequestActive] = useState(false);
	const [completion, setCompletion] = useState<Array<CompletionItem>>([]);
	const [toast, setToast] = useState("");
	const [windowAiActive, setWindowAiActive] = useState(false);

	var rawCompletion = useRef("");
	var newCompletion = useRef("");
	var curCompletion = useRef<Array<CompletionItem>>([]);
	var curActiveTools = useRef<Array<Tool>>([]);

	useEffect(() => {
		if (!setupCompleted) {
			getCookies();
		}
	}, []);

	function completeSetup(openaiApiKey: string, wasUserInput: boolean) {
		setWindowAiActive(initWindowAi());
		initializeActiveTools();

		//Conditionals required to skip setup
		if (getToolParam("Google Search", "googleAppId").length == 0) return false;
		if (openaiApiKey?.length != 51 && !getWindowAiActive()) return false;
		setSetupCompleted(true);
		return true;
	}

	function showErrorToast(msg: string, wasUserInput: boolean = true) {
		if (!wasUserInput) return false;
		setToast(msg);
		new Promise((f) =>
			setTimeout(() => {
				setToast("");
			}, 5000)
		);
		return false;
	}

	function initWindowAi() {
		if ((window as any).ai) {
			storeWindowAiActive(true, false);
		}
		return getWindowAiActive();
	}

	function getCookies() {
		completeSetup(getToolParam("Global", "openaiApiKey"), false);
	}

	function applyToolParams(tool: Tool, params: { [key: string]: string }) {
		if (!tool) return;
		curActiveTools.current.forEach((activeTool) => {
			if (activeTool.getUniqueHumanName() == tool.getUniqueHumanName())
				return activeTool.setParams(params);
		});
	}

	function updateActiveTools(tool: Tool, isActive: boolean) {
		let newActiveTools = [...curActiveTools.current];
		let index = newActiveTools.findIndex((activeTool) => {
			return activeTool.getUniqueHumanName() == tool.getUniqueHumanName();
		});
		if (!isActive) {
			if (index != -1) {
				newActiveTools.splice(index, 1);
			}
		} else {
			if (index == -1) {
				tool.setParams(getToolParams()?.[tool.getUniqueHumanName()] ?? {});
				newActiveTools.push(tool);
			}
		}
		curActiveTools.current = newActiveTools;
	}

	function initializeActiveTools(tools?: Array<Tool>) {
		if (curActiveTools.current.length != 0) return;
		let newActiveTools = tools ? tools : [...curActiveTools.current];

		const activeToolNames = getActiveToolNames();
		const toolParams = getToolParams();
		activeToolNames.forEach((toolName) => {
			allTools.forEach((tool) => {
				const toolInstance = new tool(setToolResult, setToolError);
				if (toolInstance.getUniqueHumanName() == toolName) {
					toolInstance.setParams(toolParams?.[toolName] ?? {});
					newActiveTools.push(toolInstance);
				}
			});
		});
		curActiveTools.current = newActiveTools;
		setSetupCompleted(false);
		return newActiveTools;
	}

	function updateWindowAiActive(isActive: boolean) {
		if (!getToolParam("Global", "openaiApiKey") && !isActive) return;
		storeWindowAiActive(isActive);
		setWindowAiActive(isActive);
	}

	async function sendPrompt(prompt: string) {
		//Injects user prompt into template and requests completion
		if (requestActive) return;
		//Reset all completion data
		curCompletion.current = [];
		rawCompletion.current = "";
		newCompletion.current = "";
		setRequestActive(true);
		//Inject prompt into template and get completion
		const final_prompt = formatPrompt(prompt);
		getCompletion(final_prompt);
	}

	function formatPrompt(userPrompt: string) {
		//Format prompt using all active tools and user prompt
		let toolDefinitions = "";
		let toolExamples = "";
		//For each tool, add their definitions and examples
		curActiveTools.current.forEach((tool) => {
			toolDefinitions += `${tool.getName()}: ${tool.getDefinition()}\n`;
			toolExamples += `User: ${tool.getExamplePrompt()}\nAssistant:${tool.getExampleCompletion()}\n`;
			//If multi-examples are defined, check for satisfied dependencies before adding
			if (
				tool.getExampleMultiPrompt() &&
				exampleMultiDependenciesSatisfied(tool)
			) {
				toolExamples += `User: ${tool.getExampleMultiPrompt()}\nAssistant:${tool.getExampleMultiCompletion()}\n`;
			}
		});
		//Format template
		const final_prompt = prompt_template
			.replace("TOOL_DEFINITIONS", toolDefinitions)
			.replace("TOOL_EXAMPLES", toolExamples)
			.replace("DATE_TODAY", new Date().toDateString())
			.replace("USER_INPUT", userPrompt);
		return final_prompt;
	}

	function exampleMultiDependenciesSatisfied(tool: Tool) {
		//Iterate through multi example dependencies, and check if corresponding tool
		//implementing tool name is active
		let allDependenciesSatisfied = true;
		tool.getExampleMultiDependencies().forEach((toolName) => {
			const satisfied =
				curActiveTools.current.findIndex((activeTool) => {
					return activeTool.getName() == toolName;
				}) != -1;
			allDependenciesSatisfied = satisfied ? allDependenciesSatisfied : false;
		});
		return allDependenciesSatisfied;
	}

	async function getCompletion(final_prompt: string) {
		rawCompletion.current = final_prompt;
		if (getWindowAiActive()) {
			getWindowAICompletion(
				final_prompt,
				(token: string) => handleToken(token),
				() => addError()
			);
		} else {
			getOpenAiCompletion(
				final_prompt,
				(toolName: string, paramName: string) =>
					getToolParam(toolName, paramName),
				(token: string) => handleToken(token),
				() => addError()
			);
		}
	}

	function handleToken(token: string) {
		//Trim start of completion to avoid ugly whitespace
		if (newCompletion.current.length == 0) token = token.trimStart();
		//Amend completion data
		rawCompletion.current += token;
		newCompletion.current += token;
		//Parse current completion
		let toolUsed = parseCompletion();
		setRequestActive(toolUsed);
		return toolUsed;
	}

	function parseCompletion() {
		let toolUsed = false;
		//Match for tools
		let matches = newCompletion.current.match(/([[])\S.+?(->)/g);
		if (matches) {
			//If matches exist, strip out non-tool string and complete existing item if exists
			let preToolString = newCompletion.current.replace(matches[0], "");
			amendDefaultItem(preToolString, true);
			//Add completion item for found tool
			let toolItem = addCompletionItem(matches[0], CompletionType.TOOL);
			//Reset newCompletion string once tool has been added
			newCompletion.current = "";
			//Evaluate and cancel stream
			evaluateTool(toolItem);
			toolUsed = true;
		} else {
			//If no matches exist, we are just streaming a normal completion
			//We make sure to only show characters up to a potential [
			let split = newCompletion.current.split("[");
			amendDefaultItem(split[0], false);
		}
		//For each completed parse, we update the state to trigger a re-render
		setCompletion([...curCompletion.current]);
		return toolUsed;
	}

	function addCompletionItem(
		text: string,
		type: CompletionType,
		completed = false,
		tool?: Tool
	) {
		//Add a completion item to the current stack
		let toolItem: CompletionItem = {
			text: text,
			type: type,
			completed: completed,
			tool: getTool(text),
		};
		curCompletion.current.push(toolItem);
		return toolItem;
	}

	function amendDefaultItem(text: string, complete: boolean) {
		//Amend the last default completion item if it exists, otherwise add to stack
		let lastCompletion =
			curCompletion.current[curCompletion.current.length - 1];
		if (lastCompletion && lastCompletion.type == CompletionType.DEFAULT) {
			curCompletion.current[curCompletion.current.length - 1].text = text;
			curCompletion.current[curCompletion.current.length - 1].completed =
				complete;
		} else {
			addCompletionItem(text, CompletionType.DEFAULT, true);
		}
	}

	function addError() {
		addCompletionItem(" An error occurred. :( ", CompletionType.ERROR, true);
		setCompletion(curCompletion.current);
		setRequestActive(false);
	}

	async function evaluateTool(completionItem: CompletionItem) {
		//Use tool specified in completion item if available
		const tool = completionItem.tool;
		if (tool) {
			tool.useTool(getToolInput(completionItem));
		} else {
			addError();
		}
	}

	function getTool(text: string) {
		//Get appropriate active tool for completion item if available
		return curActiveTools.current.find((tool) => {
			if (text.includes(tool.getName() + "(")) {
				return tool;
			}
		});
	}

	function setToolResult(resultString: string) {
		//Add tool result to last completion item, then continue completion stream
		resultString += "]";
		let lastCompletion =
			curCompletion.current[curCompletion.current.length - 1];
		lastCompletion.text += resultString;
		lastCompletion.completed = true;
		getCompletion(rawCompletion.current + resultString);
	}

	function setToolError(error: any) {
		addError();
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
				<img src={logo} width={toolSetupActive ? "0px" : "600px"}></img>
				{toolSetupActive ? (
					<ToolSetup
						tools={curActiveTools.current}
						showErrorToast={showErrorToast}
						setActive={setToolSetupActive}
						updateActiveTools={updateActiveTools}
						updateWindowAiActive={(isActive: boolean) =>
							updateWindowAiActive(isActive)
						}
						setToolResult={setToolResult}
						setToolError={setToolError}
						applyToolParams={applyToolParams}
					></ToolSetup>
				) : setupCompleted ? (
					<div>
						<IconButton
							onClick={() => setToolSetupActive(true)}
							sx={toolButtonStyle}
						>
							<ConstructionIcon></ConstructionIcon>
						</IconButton>
						<PromptInput
							sendPrompt={sendPrompt}
							completionReceived={completion.length > 0}
							requestActive={requestActive}
						></PromptInput>
					</div>
				) : (
					<Setup
						completeSetup={completeSetup}
						tools={curActiveTools.current}
						showErrorToast={showErrorToast}
						applyToolParams={applyToolParams}
					></Setup>
				)}
				{setupCompleted && !toolSetupActive && (
					<div className="Completion-Parent">
						{completion.map((item, index) => (
							<CompletionElement completion={item}></CompletionElement>
						))}
					</div>
				)}

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
