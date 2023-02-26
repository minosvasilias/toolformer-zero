import { all, create } from "mathjs";
import { Tool } from "./base/Tool";
import CalculateIcon from "@mui/icons-material/Calculate";
import { ReactElement } from "react";

const math = create(all, {});

export class MathJS extends Tool {
	getName(): string {
		return "MATH";
	}

	getUniqueHumanName(): string {
		return "Math JS";
	}

	getHumanDescription(): string {
		return "Evaluating strings as math expressions, returning the result.";
	}

	getDefinition(): string {
		return "This allows you to evaluate mathematical expressions using the math.js library.";
	}

	getExamplePrompt(): string {
		return "What is 10 times 14?";
	}

	getExampleCompletion(): string {
		return "10 * 14 is [MATH(10 * 14) -> 140] 140.";
	}

	getExampleMultiPrompt(): string {
		return "Has Avatar the way of water been released yet?";
	}

	getExampleMultiCompletion(): string {
		return "[SEARCH(Avatar the way of water release date) -> 22.11.2022] Avatar: The way of water was released on the 22nd of november 2022. Today is [NOW() -> DATE_TODAY] the 13th of February 2023. Therefore, [MATH(2023 > 2022) -> true] it was released last year.";
	}

	getExampleMultiDependencies(): Array<string> {
		return ["SEARCH", "NOW"];
	}

	getIcon(): ReactElement {
		return <CalculateIcon />;
	}

	async useTool(query: string) {
		//Use mathjs to evaluate query
		try {
			let result = math.evaluate(query);
			let resultString = result.toString();
			this.reportResult(resultString);
		} catch (error) {
			this.reportError(error);
		}
	}
}
