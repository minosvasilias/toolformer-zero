import { Tool } from "./base/Tool";
import { ToolParam } from "./base/ToolParam";
import FunctionsIcon from "@mui/icons-material/Functions";
import { ReactElement } from "react";
import { proxyUrl } from "./base/Cors";

const wolfram_url = "https://api.wolframalpha.com/v1/result?appid=API_KEY&i=";

export class WolframAlpha extends Tool {
	wolframApiKey = "";

	getExpectedParams(): ToolParam[] {
		return [
			{
				paramName: "wolframApiKey",
				humanName: "Wolfram Alpha API Key",
				instructions: `Create a Wolfram Alpha app at the link below,
                then copy the generated AppID.`,
				link: "https://developer.wolframalpha.com/portal/myapps/index.html",
				exampleValue: "WRG3GS-T2SRGVLT42",
			},
		];
	}

	setParams(params: { [key: string]: string }) {
		this.wolframApiKey = params.wolframApiKey ?? this.wolframApiKey;
		if (this.wolframApiKey.length != 17)
			return new Error("No valid Wolfram API Key set.");
	}

	getName(): string {
		return "WOLFRAM";
	}

	getUniqueHumanName(): string {
		return "Wolfram Alpha";
	}

	getHumanDescription(): string {
		return "Providing access to the Wolfram Alpha Short Answers API.";
	}

	getDefinition(): string {
		return "This queries Wolfram Alpha for an answer.";
	}

	getExamplePrompt(): string {
		return "What is the second derivative of sin(2x)?";
	}

	getExampleCompletion(): string {
		return "[WOLFRAM(second derivative of sin(2x)) -> -4 Sin[2x]] The second derivative of sin(2x) is -4 Sin[2x]";
	}

	getExampleMultiPrompt(): string {
		return "What are the colors of the thai flag and what is the hex code of the first one?";
	}

	getExampleMultiCompletion(): string {
		return "[WOLFRAM(colors of thailand flag) -> five horizontal bands of red (top), white, blue (double width), white, and red] The colors of the thai flag are red, white and blue. [WOLFRAM(hex code of blue) -> #0000FF] The hex code of the first one, blue, is #0000FF.";
	}

	getExampleMultiDependencies(): Array<string> {
		return [];
	}

	getIcon(): ReactElement {
		return <FunctionsIcon />;
	}

	usesCorsProxy(): boolean {
		return true;
	}

	async useTool(query: string) {
		//Fetch result from Wolfram Alpha API
		let url = proxyUrl(
			wolfram_url.replace("API_KEY", this.wolframApiKey) + encodeURI(query)
		);
		await fetch(url, {
			method: "GET",
		})
			.then((response) => response.text())
			.then((text) => {
				console.log(text);
				this.reportResult(text);
			})
			.catch((error) => {
				this.reportError(error);
				console.error(error);
			});
	}
}
