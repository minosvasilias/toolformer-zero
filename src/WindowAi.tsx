type Output = {
	text?: string;
	message?: ChatMessage;
};

type ChatMessage = {
	role: Role;
	content: string;
};

type Role = "system" | "user" | "assistant";

interface CompletionOptions {
	// If specified, partial updates will be streamed to this handler as they become available,
	// and only the first partial update will be returned by the Promise.
	onStreamResult?: (result: Output | null, error: string | null) => unknown;
	// What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
	// make the output more random, while lower values like 0.2 will make it more focused and deterministic.
	// Different models have different defaults.
	temperature?: number;
	// How many chat completion choices to generate for each input message. Defaults to 1.
	// The maximum number of tokens to generate in the chat completion. Defaults to infinity, but the
	// total length of input tokens and generated tokens is limited by the model's context length.
	maxTokens?: number;
	// Sequences where the API will stop generating further tokens.
	stopSequences?: string[];
	// Identifier of the model to use. Defaults to the user's current model, but can be overridden here.
	model?: string;
}

export async function getWindowAICompletion(
	final_prompt: string,
	handleToken: Function,
	addError: Function
) {
	//Request completion from WindowAI model
	var toolUsed = false;
	const completionOptions: CompletionOptions = {
		temperature: 0.7,
		maxTokens: 100,
		onStreamResult: (result: Output | null, error: string | null) => {
			//On result, cancel if tool was used
			if (toolUsed) return;
			//Otherwise, handle token
			if (result) {
				let token = "";
				if (result.message) {
					token = result.message.content;
				} else if (result.text) {
					token = result.text;
				}
				toolUsed = handleToken(token);
			} else if (error) {
				addError();
				console.error(error);
			}
		},
	};
	await (window as any).ai.getCurrentModel();
	await (window as any).ai.getCompletion(
		{
			messages: parsePromptAsChat(final_prompt),
		},
		completionOptions
	);
}

function parsePromptAsChat(prompt: string): ChatMessage[] {
	const messages: ChatMessage[] = [];
	//Regex finding occurences of "User: ", "Assistant: " and "]"
	const regex = /((User|Assistant):|])/g;
	//Split prompt by regex
	const splitPrompt = prompt.split(regex);
	//Add first split as system message
	messages.push({
		role: "system",
		content: splitPrompt[0],
	});
	//Iterate over split prompt, track current role and add messages
	let lastRole: Role = "system";
	splitPrompt.forEach((element, index) => {
		if (element && index > 0) {
			if (element.includes("User")) {
				lastRole = "user";
			} else if (element.includes("Assistant")) {
				lastRole = "assistant";
			} else if (element != "]") {
				let x = 0;
				//Add trailing "]" to tool calls
				if (element.includes("->")) {
					element += "]";
				}
				messages.push({
					role: lastRole,
					content: element,
				});
			}
		}
	});
	return messages;
}
