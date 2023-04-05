export async function getOpenAiCompletion(
	final_prompt: string,
	getToolParam: Function,
	handleToken: Function,
	addError: Function
) {
	//Stream completion from OpenAI);
	var es = await fetch("https://api.openai.com/v1/completions", {
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + getToolParam("Global", "openaiApiKey"),
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

	//Stream completion either until a tool was used or the completion has ended
	let toolUsed = false;
	while (!toolUsed) {
		const res = await reader?.read();
		toolUsed = await readCompletionStream(res, handleToken, addError);
		if (res?.done) break;
	}
}

async function readCompletionStream(
	res: ReadableStreamReadResult<string>,
	handleToken: Function,
	addError: Function
) {
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
				toolUsed = handleToken(token);
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
