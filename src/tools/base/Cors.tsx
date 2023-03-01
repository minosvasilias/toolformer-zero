//Default cors proxy that may be necessary for some APIs
export function proxyUrl(url: string) {
	return "https://corsproxy.io/?" + url;
}
