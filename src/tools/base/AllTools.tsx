import { Google } from "../Google";
import { MathJS } from "../MathJS";
import { Now } from "../Now";
import { Tool } from "./Tool";

export const allTools: Array<
	new (onResult?: Function, onError?: Function) => Tool
> = [Google, MathJS, Now];
