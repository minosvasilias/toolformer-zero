import { Tool } from "./tools/base/Tool";

export interface CompletionItem {
	text: string;
	type: CompletionType;
	completed: boolean;
	tool?: Tool;
}

export enum CompletionType {
	DEFAULT,
	TOOL,
	ERROR,
}

export function getPayload(completionItem: CompletionItem) {
	if (completionItem.type == CompletionType.DEFAULT) {
		return completionItem.text;
	} else if (completionItem.type == CompletionType.TOOL) {
		return sanitizeText(
			completionItem.text,
			completionItem.tool?.getName() + "("
		);
	}
	return completionItem.text.replace("]", "");
}

export function getToolInput(completionItem: CompletionItem) {
	let payload = getPayload(completionItem);
	return payload.split("->")[0];
}

export function getToolOutput(completionItem: CompletionItem) {
	let payload = getPayload(completionItem);
	let split = payload.split("->");
	return split[split.length - 1];
}

function sanitizeText(text: string, toolKey: string) {
	return text
		.replace("[", "")
		.replace(toolKey, "")
		.replace(")", "")
		.replace("]", "")
		.trim();
}
