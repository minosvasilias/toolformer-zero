import { Tool } from "./base/Tool";
import { ToolParam } from "./base/ToolParam";
import SearchIcon from "@mui/icons-material/Search";
import { ReactElement } from "react";

const google_url =
	"https://www.googleapis.com/customsearch/v1?key=API_KEY&cx=APP_ID&q=";
const max_search_results = 20;

export class Google extends Tool {
	googleAppId = "";
	googleApiKey = "";

	getExpectedParams(): ToolParam[] {
		return [
			{
				paramName: "googleAppId",
				humanName: "Google App ID",
				instructions: `Create a custom Google search engine to get your app ID.
				You can create a search engine at the link below. 
				Make sure to select "Search the entire web."
				Then, copy the code shown after "cx=" in the generated code block.`,
				link: "https://programmablesearchengine.google.com/controlpanel/create",
				exampleValue: "6145dmd5f025a4527",
			},
			{
				paramName: "googleApiKey",
				humanName: "Google API Key",
				instructions: `Enable the Google Custom Search API in your Google Cloud account.
				You can find the API at the link below.
				After enabling, click on the "Credentials" button on the left.
				If no API key is listed under "API keys", create a new one 
				by pressing "+ Create Credentials" and then "API key" at the top,
				then copy the generated API key`,
				link: "https://console.cloud.google.com/apis/api/customsearch.googleapis.com",
				exampleValue: "AItrHrHjUl-PW3bBl2TosxXSv4REwGWc2yMfTs0",
			},
		];
	}

	setParams(params: { [key: string]: string }) {
		this.googleAppId = params.googleAppId ?? this.googleAppId;
		this.googleApiKey = params.googleApiKey ?? this.googleApiKey;
		if (this.googleAppId.length != 17)
			return new Error("No valid Google App ID set.");
		if (this.googleApiKey.length != 39)
			return new Error("No valid Google API key set.");
	}

	getName(): string {
		return "SEARCH";
	}

	getUniqueHumanName(): string {
		return "Google Search";
	}

	getHumanDescription(): string {
		return "Providing access to the Google Search API, returning snippets of web search results.";
	}

	getDefinition(): string {
		return "This returns a web search result for the given string argument.";
	}

	getExamplePrompt(): string {
		return "How old is Donald Trump?";
	}

	getExampleCompletion(): string {
		return "Donald Trump is [SEARCH(Donald Trump age) -> 76] 76 years old.";
	}

	getExampleMultiPrompt(): string {
		return "Where was the inventor of the light bulb born, and what is the last country his home country was at war with?";
	}

	getExampleMultiCompletion(): string {
		return "Thomas Edison, the inventor of the lightbulb, was born in [SEARCH(Thomas Edison birthplace) -> Milan, Ohio] Milan, Ohio. The last country the United States was at war with was [SEARCH(last country US at war with) -> Iraq] Iraq.";
	}

	getExampleMultiDependencies(): Array<string> {
		return [];
	}

	getIcon(): ReactElement {
		return <SearchIcon />;
	}

	async useTool(query: string) {
		//Fetch result from Google Search API
		let url =
			google_url
				.replace("APP_ID", this.googleAppId)
				.replace("API_KEY", this.googleApiKey) + encodeURI(query);
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
				this.reportResult(resultString.replace("]", ""));
			})
			.catch((error) => {
				this.reportError(error);
				console.error(error);
			});
	}
}
