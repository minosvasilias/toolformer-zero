import { createTheme } from "@mui/material";
import { all, create } from "mathjs";

export const math = create(all, {});

export const google_url =
	"https://www.googleapis.com/customsearch/v1?key=API_KEY&cx=APP_ID&q=";
export const max_search_results = 20;

export const prompt_template = `You are an AI assistant with several tools available to you. The tools are the following:
MATH: This allows you to evaluate mathematical expressions using the math.js library.
NOW: This returns the current date and time. You must not pass any arguments to this tool!
SEARCH: This returns a web search result for the given string argument.
DO NOT USE TOOLS WITHIN TOOLS! KEEP ALL TOOL CALLS SEPARATE FROM EACH OTHER!

User: What is 10 times 14?
Assistant: 10 * 14 is [MATH(10 * 14) -> 140] 140.
User: How old is Donald Trump?
Assistant: Donald Trump is [SEARCH(Donald Trump age) -> 76] 76 years old.
User: What day is it?
Assistant: It is [NOW() -> 13/02/2023, 20:01:35] the 13th of February 2023.
User: Has Avatar the way of water been released yet?
Assistant: [SEARCH(Avatar the way of water release date) -> 22.11.2022] Avatar: The way of water was released on the 22nd of november 2022. Today is [NOW() -> DATE_TODAY] the 13th of February 2023. Therefore, [MATH(2023 > 2022) -> true] it was released last year.
User: Where was the inventor of the light bulb born, and what is the last country his home country was at war with?
Assistant: Thomas Edison, the inventor of the lightbulb, was born in [SEARCH(Thomas Edison birthplace) -> Milan, Ohio] Milan, Ohio. The last country the United States was at war with was [SEARCH(last country US at war with) -> Iraq] Iraq.
User: USER_INPUT
Assistant:`;

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#ff833b",
		},
		secondary: { main: "#000000", contrastText: "#fff" },
	},
});
