import { ReactElement } from "react";
import { Tool } from "./base/Tool";
import { ToolParam } from "./base/ToolParam";
import CloudIcon from "@mui/icons-material/Cloud";
import axios from "axios";

export class Weather extends Tool {
	private apiKey: string | undefined;

	constructor(_onResult?: Function, _onError?: Function) {
		super(_onResult, _onError);
	}

	async useTool(query: string): Promise<void> {
		try {
			const response = await axios.get(
				`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${this.apiKey}`
			);
			const weather = response.data;
			const description = weather.weather[0].description;
			const temperature = weather.main.temp;
			const city = weather.name;
			const result = `The weather in ${city} is ${description} and the temperature is ${temperature}°C.`;
			this.reportResult(result);
		} catch (error) {
			this.reportError(error);
		}
	}

	getName(): string {
		return "WEATHER";
	}

	getUniqueHumanName(): string {
		return "Weather";
	}

	getHumanDescription(): string {
		return "Retrieve weather information for a given city.";
	}

	getDefinition(): string {
		return "This tool retrieves current weather information for a given city using the OpenWeatherMap API. You must pass a city name as an argument.";
	}

	getExamplePrompt(): string {
		return "What is the weather like in London?";
	}

	getExampleCompletion(): string {
		return "The weather in London is [WEATHER(London) -> cloudy] cloudy.";
	}

	getIcon(): ReactElement {
		return <CloudIcon />;
	}

	usesCorsProxy(): boolean {
		return false;
	}

	getExpectedParams(): Array<ToolParam> {
		return [
			{
				humanName: "API Key",
				paramName: "apiKey",
				instructions: "Sign up for a free API key from OpenWeatherMap.",
				link: "https://openweathermap.org/api",
				exampleValue: "your_api_key_here",
			},
		];
	}

	setParams(params: { [paramName: string]: string }): Error | undefined {
		if (params.apiKey) {
			this.apiKey = params.apiKey;
		} else {
			return new Error("API Key is required for WeatherTool.");
		}
	}
}
