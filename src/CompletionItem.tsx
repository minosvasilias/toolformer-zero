export interface CompletionItem {
	text: string;
	type: CompletionType;
	completed: boolean;
	toolType?: ToolType;
}

export enum CompletionType {
	DEFAULT,
	TOOL,
	ERROR,
}

export enum ToolType {
	NONE,
	MATH,
	NOW,
	SEARCH,
}

export function getPayload(completionItem: CompletionItem) {
	if (completionItem.type == CompletionType.DEFAULT) {
		return completionItem.text;
	} else if (completionItem.type == CompletionType.TOOL) {
		switch (completionItem.toolType) {
			case ToolType.MATH:
				return sanitizeText(completionItem.text, "MATH(");

			case ToolType.NOW:
				return sanitizeText(completionItem.text, "NOW(");

			case ToolType.SEARCH:
				return sanitizeText(completionItem.text, "SEARCH(");
		}
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

export function getToolType(text: string) {
	if (text.includes("MATH(")) {
		return ToolType.MATH;
	} else if (text.includes("NOW(")) {
		return ToolType.NOW;
	} else if (text.includes("SEARCH(")) {
		return ToolType.SEARCH;
	} else {
		return ToolType.NONE;
	}
}
