import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Link,
	Step,
	StepContent,
	StepLabel,
	Stepper,
	TextField,
} from "@mui/material";
import { paramsTextFieldStyle, setupCardStyle } from "./MuiStyles";
import { Tool } from "./tools/base/Tool";
import { getToolParam, getWindowAiActive, updateToolParams } from "./Cookies";
import { primaryColor } from "./Constants";
import { useState } from "react";

interface SetupProps {
	completeSetup?: Function;
	tools: Array<Tool>;
	showErrorToast: Function;
	setAllowActiveError?: Function;
	applyToolParams: Function;
}

interface Step {
	id: number;
	label: string;
	title: string;
	link: string;
	hint: string;
	placeholder: string;
	param: string;
	tool?: Tool;
}

const defaultSteps: Array<Step> = [
	{
		id: 0,
		label: "OpenAI API Key",
		title: `Create an OpenAI account and generate an API key.
        You can find your OpenAI API keys at the link below.`,
		link: "https://platform.openai.com/account/api-keys",
		hint: "Enter your OpenAI API Key here",
		placeholder: "sk-i5g5RAperSLt2IvHptK7T6DlbkFJ2vswBTa1Id5QBB6NsrPO",
		param: "openaiApiKey",
	},
];

export function ParamsSetup(props: SetupProps) {
	const [params, setParams] = useState<{ [key: string]: string }>({});
	const [activeStep, setActiveStep] = useState(validateParams() ? 0 : -1);

	function setParam(paramName: string, paramValue: string) {
		//Update params state
		params[paramName] = paramValue;
		setParams(params);
	}

	function getParam(toolName: string, paramName: string) {
		//Fall back to cookie if no param saved in state
		return params[paramName] ?? getToolParam(toolName, paramName);
	}

	function handleNext() {
		//Handle next button press
		if (activeStep == steps.length - 1) {
			//If last step, assemble all params, and check for errors
			const toolParams = assembleParams();
			const error = validateParams();
			if (error) return props.showErrorToast(error.message);

			//If no errors, apply params to active tools
			props.tools.forEach((tool) => {
				const toolName = tool.getUniqueHumanName();
				props.applyToolParams(tool, toolParams[toolName] ?? {});
			});
			//and update cookies
			updateToolParams(toolParams);
			//Then, complete setup if available and finish
			const success = props.completeSetup
				? props.completeSetup(params.openaiApiKey, true)
				: true;
			if (success) setActiveStep(-1);
			else props.showErrorToast("No valid OpenAI API key set.");
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	}

	function handleBack() {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	}

	function validateParams() {
		//Check for errors when applying params to tools
		const toolParams = assembleParams();
		let error: Error | undefined;
		props.tools.forEach((tool) => {
			error = tool.setParams(toolParams?.[tool.getUniqueHumanName()]) ?? error;
		});
		if (props.setAllowActiveError) props.setAllowActiveError(error);
		return error;
	}

	function assembleParams() {
		//Assemble all params changed by this element
		//and add into object compatible with cookies data
		const toolParams: {
			[toolName: string]: { [paramName: string]: string };
		} = {};
		getSteps().forEach((step) => {
			const name = step.tool?.getUniqueHumanName() ?? "Global";
			toolParams[name] = toolParams[name] ?? {};
			toolParams[name][step.param] = getParam(name, step.param);
		});
		return toolParams;
	}

	function showOpenAiSetup() {
		return props.completeSetup && !(window as any).ai;
	}

	function getSteps() {
		//Get all required steps
		//This can be default steps on initial setup
		//as well as all params required by the specified tool(s)
		const totalSteps: Array<Step> = showOpenAiSetup() ? [...defaultSteps] : [];
		props.tools.forEach((tool, index) => {
			const expectedParams = tool.getExpectedParams();
			if (expectedParams.length != 0) {
				expectedParams.forEach((param) => {
					const step: Step = {
						id: index + 1,
						param: param.paramName,
						label: param.humanName,
						title: param.instructions,
						link: param.link,
						hint: `Enter your ${param.humanName} here`,
						placeholder: param.exampleValue,
						tool: tool,
					};
					totalSteps.push(step);
				});
			}
		});
		return totalSteps;
	}
	const steps = getSteps();

	return (
		<Stepper
			activeStep={activeStep}
			orientation="vertical"
			sx={{
				opacity: activeStep === steps.length ? 0 : 1,
				marginTop: activeStep === steps.length ? "-50px" : "0px",
				transition: "all 200ms",
			}}
		>
			{steps.map((step, index) => (
				<Step key={step.label}>
					<StepLabel
						onClick={() => {
							setActiveStep(index);
						}}
					>
						<Button
							sx={{ color: index == activeStep ? primaryColor : "black" }}
						>
							{step.label}
						</Button>
					</StepLabel>
					<StepContent>
						<Card sx={setupCardStyle}>
							<CardHeader
								title={step.title}
								titleTypographyProps={{
									whiteSpace: "pre-line",
									variant: "subtitle2",
								}}
								subheader={
									<Link target={"_blank"} variant="caption" href={step.link}>
										{step.link}
									</Link>
								}
							></CardHeader>
							<CardContent>
								<TextField
									id="outlined-basic"
									size="small"
									label={step.hint}
									variant="standard"
									autoComplete="off"
									defaultValue={getParam(
										step.tool?.getUniqueHumanName() ?? "",
										step.param
									)}
									placeholder={step.placeholder}
									onChange={(event) => {
										setParam(step.param, event.target.value);
									}}
									sx={paramsTextFieldStyle}
								/>
							</CardContent>
						</Card>
						<Box sx={{ mb: 2 }}>
							<div>
								<Button variant="contained" onClick={handleNext}>
									{index === steps.length - 1 ? "Finish" : "Next"}
								</Button>
								<Button onClick={handleBack}>
									{index == 0 ? "Cancel" : "Back"}
								</Button>
							</div>
						</Box>
					</StepContent>
				</Step>
			))}
		</Stepper>
	);
}
