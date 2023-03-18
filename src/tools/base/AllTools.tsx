import { Google } from "../Google";
import { MathJS } from "../MathJS";
import { Now } from "../Now";
import { SpotifyPlaylist } from "../SpotifyPlaylist";
import { TextToSpeech } from "../TextToSpeech";
import { Weather } from "../Weather";
import { WolframAlpha } from "../WolframAlpha";
import { Tool } from "./Tool";

export const allTools: Array<
	new (onResult?: Function, onError?: Function) => Tool
> = [Google, MathJS, Now, WolframAlpha, SpotifyPlaylist, Weather, TextToSpeech];
