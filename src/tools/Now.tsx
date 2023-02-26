import { Tool } from "./base/Tool";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { ReactElement } from "react";

export class Now extends Tool {
	getName(): string {
		return "NOW";
	}

	getUniqueHumanName(): string {
		return "Now";
	}

	getHumanDescription(): string {
		return "Providing access to the current date and time. Takes no arguments, always returns the current time.";
	}

	getDefinition(): string {
		return "This returns the current date and time. You must not pass any arguments to this tool!";
	}

	getExamplePrompt(): string {
		return "What day is it?";
	}

	getExampleCompletion(): string {
		return "It is [NOW() -> 13/02/2023, 20:01:35] the 13th of February 2023.";
	}

	getIcon(): ReactElement {
		return <CalendarMonthIcon />;
	}

	async useTool(query: string) {
		//Get current date
		let dateString = new Date().toLocaleString();
		this.reportResult(dateString);
	}
}
