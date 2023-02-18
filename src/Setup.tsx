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
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Stack } from "@mui/system";
import { setupCardStyle } from "./MuiStyles";

interface SetupProps {
	completeSetup: Function;
}

interface Step {
	id: number;
	label: string;
	title: string;
	help: string;
	link: string;
	hint: string;
	placeholder: string;
	getter: Function;
	setter: Function;
}

export function Setup(props: SetupProps) {
	const [openaiApiKey, setOpenaiApiKey] = useState("");
	const [googleAppId, setGoogleAppId] = useState("");
	const [googleApiKey, setGoogleApiKey] = useState("");
	const [activeStep, setActiveStep] = useState(0);

	function getOpenaiApiKey() {
		return openaiApiKey;
	}
	function getGoogleAppId() {
		return googleAppId;
	}
	function getGoogleApiKey() {
		return googleApiKey;
	}

	const steps: Array<Step> = [
		{
			id: 0,
			label: "OpenAI API Key",
			title: `Create an OpenAI account and generate an API key.
            You can find your OpenAI API keys at the link below.`,
			help: "platform.openai.com/account/api-keys",
			link: "https://platform.openai.com/account/api-keys",
			hint: "Enter your OpenAI API Key here",
			placeholder: "sk-i5g5RAperSLt2IvHptK7T6DlbkFJ2vswBTa1Id5QBB6NsrPO",
			getter: getOpenaiApiKey,
			setter: setOpenaiApiKey,
		},
		{
			id: 1,
			label: "Google Custom Search App ID",
			title: `Create a custom Google search engine to get your app ID.
            You can create a search engine at the link below. 
            Make sure to select "Search the entire web."
            Then, copy the code shown after "cx=" in the generated code block.`,
			placeholder: "6145dmd5f025a4527",
			help: `programmablesearchengine.google.com/controlpanel/create`,
			link: "https://programmablesearchengine.google.com/controlpanel/create",
			hint: "Enter your Google App ID here",
			getter: getGoogleAppId,
			setter: setGoogleAppId,
		},
		{
			id: 2,
			label: "Google Custom Search API Key",
			title: `Enable the Google Custom Search API in your Google Cloud account.
            You can find the API at the link below.
            After enabling, click on the "Credentials" button on the left.
            If no API key is listed under "API keys", create a new one 
            by pressing "+ Create Credentials" and then "API key" at the top,
            then copy the generated API key`,
			placeholder: "AItrHrHjUl-PW3bBl2TosxXSv4REwGWc2yMfTs0",
			help: "console.cloud.google.com/apis/api/customsearch.googleapis.com",
			link: "https://console.cloud.google.com/apis/api/customsearch.googleapis.com",
			hint: "Enter your Google API Key here",
			getter: getGoogleApiKey,
			setter: setGoogleApiKey,
		},
	];

	const handleNext = () => {
		if (activeStep == steps.length - 1) {
			const success = props.completeSetup(
				openaiApiKey,
				googleAppId,
				googleApiKey,
				true
			);
			if (success) setActiveStep((prevActiveStep) => prevActiveStep + 1);
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	return (
		<Stack spacing={2}>
			<Typography whiteSpace={"pre-line"} variant="body2">
				{`Welcome to Toolformer Zero!
                
                To start, you'll need to input a couple of API keys in order for model and search APIs to work.`}
			</Typography>
			<Typography
				whiteSpace={"pre-line"}
				sx={{ fontWeight: "bold" }}
				variant="body2"
			>
				{`Your keys will only be used locally, and stored via browser cookie!
                No requests will be made other than those to OpenAI and Google Search APIs.`}
			</Typography>

			<Typography whiteSpace={"pre-line"} variant="body2">
				{`This project is open source, and you can view it `}
				<Link
					target={"_blank"}
					href="https://github.com/minosvasilias/toolformer-zero"
				>
					{"here."}
				</Link>
			</Typography>
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
							optional={
								index === 2 ? (
									<Typography variant="caption">Last step</Typography>
								) : null
							}
						>
							{step.label}
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
											{step.help}
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
										value={step.getter()}
										placeholder={step.placeholder}
										onChange={(event) => {
											step.setter(event.target.value);
										}}
										sx={{
											minWidth: "500px",
										}}
									/>
								</CardContent>
							</Card>
							<Box sx={{ mb: 2 }}>
								<div>
									<Button variant="contained" onClick={handleNext}>
										{index === steps.length - 1 ? "Finish" : "Next"}
									</Button>
									<Button disabled={index === 0} onClick={handleBack}>
										Back
									</Button>
								</div>
							</Box>
						</StepContent>
					</Step>
				))}
			</Stepper>
		</Stack>
	);
}
