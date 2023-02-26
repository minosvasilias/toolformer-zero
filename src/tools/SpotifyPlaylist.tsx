import { Tool } from "./base/Tool";
import { ToolParam } from "./base/ToolParam";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import { ReactElement } from "react";

const ifttt_url =
	"https://maker.ifttt.com/trigger/spotify/with/key/IFTTT_KEY?value1=";

export class SpotifyPlaylist extends Tool {
	iftttWebhookKey = "";

	getExpectedParams(): ToolParam[] {
		return [
			{
				paramName: "iftttWebhookKey",
				humanName: "IFTTT Webhook Key",
				instructions: `In your IFTTT account, create a new applet.
                For the IF step, search for "Webhooks" and select "Receive a web request".
                For the event name, enter "spotify".
                For the THEN step, search for "Spotify" and select "Add track to a playlist".
                For the Search Query, enter "{{Value1}}".
                Create the applet. Then go to the link below and copy the code
                after "https://maker.ifttt.com/use/". This is your webhook key.`,
				link: "https://ifttt.com/maker_webhooks/settings",
				exampleValue: "h_BWEPvRdWs-iPR4-BKdlW",
			},
		];
	}

	setParams(params: { [key: string]: string }) {
		this.iftttWebhookKey = params.iftttWebhookKey ?? this.iftttWebhookKey;
		if (this.iftttWebhookKey.length == 0)
			return new Error("No valid IFTTT Webhook Key set.");
	}

	getName(): string {
		return "PLAYLISTADD";
	}

	getUniqueHumanName(): string {
		return "Spotify Playlist";
	}

	getHumanDescription(): string {
		return "Allows adding songs to a spotify playlist using IFTTT webhooks.";
	}

	getDefinition(): string {
		return "This will search for a spotify song and add it to the users playlist.";
	}

	getExamplePrompt(): string {
		return "Add Get Down Saturday Night to my playlist.";
	}

	getExampleCompletion(): string {
		return "[PLAYLISTADD(Get Down Saturday Night) -> Success] Added Get Down Saturday Night to your Spotify playlist!";
	}

	getExampleMultiPrompt(): string {
		return "Add the current UK number one single to my playlist.";
	}

	getExampleMultiCompletion(): string {
		return "[SEARCH(UK number one single) -> 1. FLOWERS · MILEY CYRUS ; 2, 3. BOY'S A LIAR · PINKPANTHERESS ; 3, 4. KILL BILL · SZA.] The current number one UK single is Miley Cyrus - Flowers. [PLAYLISTADD(Miley Cyrus Flowers) -> Success] I've added it to your playlist!";
	}

	getExampleMultiDependencies(): Array<string> {
		return ["SEARCH"];
	}

	getIcon(): ReactElement {
		return <QueueMusicIcon />;
	}

	async useTool(query: string) {
		//Send IFTTT webhook request
		let url =
			ifttt_url.replace("IFTTT_KEY", this.iftttWebhookKey) + encodeURI(query);
		await fetch(url, {
			method: "POST",
			headers: new Headers({
				Accept: "application/json",
				"Content-Type": "x-www-form-urlencoded",
			}),
			mode: "no-cors",
		})
			//Due to no-cors, we have to assume the request was successful
			.then((response) => this.reportResult("Success"))
			.catch((error) => {
				this.reportError(error);
				console.error(error);
			});
	}
}
