import Cookies from "universal-cookie";
import { defaultTools } from "./Constants";
import { Tool } from "./tools/base/Tool";

export function getToolParams() {
	const cookies = new Cookies();
	const toolParams: {
		[toolName: string]: { [paramName: string]: string };
	} = cookies.get("toolParams") ?? [];
	return toolParams;
}

export function getToolParam(toolName: string, paramName: string) {
	const toolParams = getToolParams();
	return toolParams[toolName]?.[paramName] ?? "";
}

export function updateToolParams(newToolParams: {
	[toolName: string]: { [paramName: string]: string };
}) {
	//Save params for tools via cookie
	const cookies = new Cookies();
	let toolParams = Object.assign({}, getToolParams(), newToolParams);

	cookies.set("toolParams", toolParams, {
		path: "/",
	});
}

export function getActiveToolNames() {
	const cookies = new Cookies();
	const activeToolNames: Array<string> =
		cookies.get("activeTools") ?? defaultTools;
	return activeToolNames;
}

export function isToolActive(tool: Tool) {
	const activeToolNames = getActiveToolNames();
	return activeToolNames.includes(tool.getUniqueHumanName());
}

export function addActiveTool(toolName: string) {
	//Save active tools via cookie
	const cookies = new Cookies();
	let activeToolNames = getActiveToolNames();
	const index = activeToolNames.indexOf(toolName, 0);
	if (index == -1) {
		activeToolNames.push(toolName);
		cookies.set("activeTools", activeToolNames, {
			path: "/",
		});
	}
}

export function removeActiveTool(toolName: string) {
	//Save active tools via cookie
	const cookies = new Cookies();
	let activeToolNames = getActiveToolNames();
	const index = activeToolNames.indexOf(toolName, 0);
	if (index > -1) {
		activeToolNames.splice(index, 1);
	}

	cookies.set("activeTools", activeToolNames, {
		path: "/",
	});
}

export function getWindowAiActive() {
	//Get window.ai setting
	const cookies = new Cookies();
	return cookies.get("windowAiActive") == "true" ?? false;
}

export function storeWindowAiActive(isActive: boolean) {
	//Save window.ai setting
	const cookies = new Cookies();
	cookies.set("windowAiActive", isActive, {
		path: "/",
	});
}
