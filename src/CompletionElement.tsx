import {
	Typography,
	Box,
	CircularProgress,
	IconButton,
	Card,
	CardContent,
	CardHeader,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import {
	CompletionItem,
	CompletionType,
	getPayload,
	getToolInput,
	getToolOutput,
} from "./CompletionItem";
import {
	cardContentStyle,
	cardHeaderStyle,
	completionDetailsStyle,
	completionTypographyStyle,
	iconStyle,
} from "./MuiStyles";

interface CompletionProps {
	completion: CompletionItem;
}

interface CompletionTypographyProps {
	text: string;
	color?: string;
	index?: number;
}

interface CompletionDetailsProps {
	completion: CompletionItem;
	isOpen: boolean;
	setOpen: Function;
}

export function CompletionElement(props: CompletionProps) {
	if (props.completion.type == CompletionType.DEFAULT) {
		if (getPayload(props.completion).length == 0) {
			return null;
		} else {
			return (
				<React.Fragment>
					{getPayload(props.completion)
						.trim()
						.split(" ")
						.map((word, index, map) => (
							<CompletionTypography
								text={word + (index === map.length - 1 ? "" : " ")}
								index={index}
							></CompletionTypography>
						))}
				</React.Fragment>
			);
		}
	} else if (props.completion.type == CompletionType.TOOL) {
		return <CompletionTool completion={props.completion}></CompletionTool>;
	} else {
		return (
			<CompletionTypography
				text={props.completion.text}
				color={"red"}
				index={-1}
			></CompletionTypography>
		);
	}
}

function CompletionTypography(props: CompletionTypographyProps) {
	const [transitionState, setTransitionState] = useState(false);

	setTimeout(function () {
		setTransitionState(true);
	}, 50);

	return (
		<Typography
			key={props.index}
			color={props.color}
			display="inline-block"
			sx={{ ...completionTypographyStyle, opacity: transitionState ? 1 : 0 }}
		>
			{props.text}
		</Typography>
	);
}

function CompletionTool(props: CompletionProps) {
	const [transitionState, setTransitionState] = useState(false);
	const [detailsOpened, setDetailsOpened] = useState(false);

	setTimeout(function () {
		setTransitionState(true);
	}, 50);
	return (
		<Box
			key={props.completion.text}
			display={"inline-block"}
			sx={{ opacity: transitionState ? 1 : 0, transition: "all 1000ms" }}
		>
			{!props.completion.completed && (
				<CircularProgress
					size={40}
					sx={{ ...iconStyle, position: "absolute" }}
				></CircularProgress>
			)}
			<IconButton
				sx={iconStyle}
				onClick={() => {
					setDetailsOpened(true);
				}}
			>
				<CompletionIcon completion={props.completion}></CompletionIcon>
			</IconButton>
			<CompletionDetails
				completion={props.completion}
				isOpen={detailsOpened}
				setOpen={setDetailsOpened}
			></CompletionDetails>
		</Box>
	);
}

function CompletionIcon(props: CompletionProps) {
	return (
		props.completion.tool?.getIcon() ?? <QuestionMarkIcon></QuestionMarkIcon>
	);
}

function CompletionDetails(props: CompletionDetailsProps) {
	const ref = useRef<HTMLDivElement>(null);

	//Close when click outside of element detected
	useEffect(() => {
		function handleClickOutside(event: MouseEvent): void {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				props.setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});

	return (
		<Card
			ref={ref}
			sx={{
				...completionDetailsStyle,
				transform: props.isOpen
					? "translate(-50%, -50%) scale(1,1)"
					: "translate(-50%, -50%) scale(0.9,0.9)",
				opacity: props.isOpen ? 1 : 0,
				pointerEvents: props.isOpen ? "" : "none",
			}}
		>
			<CardHeader
				avatar={<CompletionIcon completion={props.completion}></CompletionIcon>}
				titleTypographyProps={{ sx: { userSelect: "none", color: "black" } }}
				title={getToolInput(props.completion)}
				sx={cardHeaderStyle}
			/>
			<CardContent sx={cardContentStyle}>
				<Typography variant="caption">
					{props.completion.tool
						? getToolOutput(props.completion)
						: "Tool not found. :("}
				</Typography>
			</CardContent>
		</Card>
	);
}
