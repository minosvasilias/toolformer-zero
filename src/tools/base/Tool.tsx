/*
    Base class for any tool exposed to the model.
*/

import { ReactElement } from "react";
import { ToolParam } from "./ToolParam";

export abstract class Tool {
	onResult: Function;
	onError: Function;

	//Tools may add optional arguments to their constructor
	constructor(_onResult?: Function, _onError?: Function) {
		this.onResult = _onResult ?? (() => {});
		this.onError = _onError ?? (() => {});
	}

	//Tools are expected to call this method once they have
	//received and formatted their result
	reportResult(result: string) {
		this.onResult(result);
	}

	//Tools are expected to call this method if their execution failed
	reportError(error: any) {
		this.onError(error);
	}

	//Tools must implement this method. It will be called whenever the
	//model attempts to use the tool
	abstract useTool(query: string): void;

	//Tools must return a simple, ALL-CAPS name the model can use to invoke it.
	//For example:
	//SEARCH, MATH, MAIL.
	//Multiple tools implementing the same name may not be used together.
	abstract getName(): string;

	//Tools must also provide a human name to be shown in the list of available tools.
	//This name is also used to store tool-related settings, so it must be unique!
	abstract getUniqueHumanName(): string;

	//Tools must provide a human description shown to users, explaining the function of the tool.
	abstract getHumanDescription(): string;

	//Tools must provide a simple description of how the tool works.
	//This will be provided to the model to help it understand general dos and don'ts
	//For example:
	//"This returns the current date and time. You must not pass any arguments to this tool!"
	abstract getDefinition(): string;

	//Tools must provide an example prompt showing the kind of query that may
	//trigger a tool invocation.
	//For example, a MATH tool may provide the example prompt:
	//"What is 10 times 14?"
	abstract getExamplePrompt(): string;

	//Tools must provide an example completion showing the tool in action.
	//All tool invocations follow the pattern: [TOOL_NAME(TOOL_QUERY) -> TOOL_RESULT]
	//For example, a MATH tool may provide the example completion:
	//"10 * 14 is [MATH(10 * 14) -> 140] 140."
	abstract getExampleCompletion(): string;

	//Tools may provide an example triggering the use of multiple tool invocations
	//These can be multiple invocations of the tool itself, or ones involving others
	//For example:
	//"Has Avatar the way of water been released yet?"
	getExampleMultiPrompt(): string | undefined {
		return;
	}

	//If above multi-prompt is defined, tools must also provide a corresponding completion.
	//For example:
	//"[SEARCH(Avatar the way of water release date) -> 22.11.2022] Avatar: The way of water
	//was released on the 22nd of november 2022. Today is [NOW() -> DATE_TODAY] the 13th of
	//February 2023. Therefore, [MATH(2023 > 2022) -> true] it was released last year."
	getExampleMultiCompletion(): string | undefined {
		return;
	}

	//If a multi-example is defined, tools must also provide a list of dependencies for
	//other tools used in the example. This correspond to the getName() value of those tools.
	//Using above example, and assuming they was defined in a "MATH" tool, this should return:
	//["SEARCH", "NOW"]
	getExampleMultiDependencies(): Array<string> {
		return [];
	}

	//Tools must return an icon as a ReactElement
	//Preferably these are Material-UI icons
	abstract getIcon(): ReactElement;

	//Tools may provide an array of string params the must be passed to them
	//after construction, such as API keys. This may be left empty if none are needed.
	getExpectedParams(): Array<ToolParam> {
		return [];
	}

	//Tools may receive values for the expected params defined in above method here.
	//This will be called after construction, once the user has provided the
	//required values.
	setParams(params: { [paramName: string]: string }): Error | undefined {
		return;
	}
}
