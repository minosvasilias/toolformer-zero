import {
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
} from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

interface InputProps {
	sendPrompt: Function;
	completionReceived: boolean;
	requestActive: boolean;
}

export function PromptInput(props: InputProps) {
	const [inputValue, setInputValue] = useState("");
	const [inputFocus, setInputFocus] = useState(false);

	return (
		<TextField
			id="outlined-basic"
			label="Enter your prompt"
			variant="outlined"
			autoComplete="off"
			onKeyDown={(ev) => {
				if (ev.key === "Enter") {
					props.sendPrompt(inputValue);
				}
			}}
			onChange={(event) => {
				setInputValue((event.target as HTMLTextAreaElement).value);
			}}
			onFocus={() => {
				setInputFocus(true);
			}}
			onBlur={() => {
				setInputFocus(false);
			}}
			sx={{
				minWidth: inputFocus || inputValue.length > 0 ? "550px" : "500px",
				marginBottom: props.completionReceived ? "100px" : "0px",
				transition: "all 200ms",
			}}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						{props.requestActive ? (
							<CircularProgress size={40}></CircularProgress>
						) : (
							<IconButton
								edge="end"
								color="primary"
								onClick={() => {
									props.sendPrompt(inputValue);
								}}
							>
								<SendIcon />
							</IconButton>
						)}
					</InputAdornment>
				),
			}}
		/>
	);
}
