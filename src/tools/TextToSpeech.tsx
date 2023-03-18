import { ReactElement } from "react";
import { Tool } from "./base/Tool";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

export class TextToSpeech extends Tool {
	constructor(_onResult?: Function, _onError?: Function) {
		super(_onResult, _onError);
	}

	useTool(query: string): void {
		if (!("speechSynthesis" in window)) {
			this.reportError("The Web Speech API is not supported by this browser.");
			return;
		}

		const utterance = new SpeechSynthesisUtterance(query);
		utterance.onend = () => this.reportResult("Playback finished.");
		utterance.onerror = (event) => this.reportError(event.error);
		speechSynthesis.speak(utterance);
	}

	getName(): string {
		return "TTS";
	}

	getUniqueHumanName(): string {
		return "Text to Speech";
	}

	getHumanDescription(): string {
		return "Converts text to speech and plays it back.";
	}

	getDefinition(): string {
		return "This tool converts the text passed as an argument to speech and plays it back.";
	}

	getExamplePrompt(): string {
		return "How does 'Hello World' sound like in speech?";
	}

	getExampleCompletion(): string {
		return "Here's how 'Hello World' sounds like: [TTS(Hello World) -> AUDIO_PLAYBACK]";
	}

	getIcon(): ReactElement {
		return <VolumeUpIcon />;
	}
}
