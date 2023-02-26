export interface ToolParam {
	//Human-readable name that will be shown to users
	humanName: string;
	//Name of param. This will be passed as a key in Tool.setParams()
	paramName: string;
	//Human-readable instructions on how a user is expected to retrieve the values passed to the tool.
	instructions: string;
	//Link that may be helpful for the user to complete the instructions.
	link: string;
	//Example value to give the user an idea of the correct format.
	//DO NOT USE REAL API-KEYS OR OTHER SECURITY-SENSITIVE DATA HERE
	exampleValue: string;
}
