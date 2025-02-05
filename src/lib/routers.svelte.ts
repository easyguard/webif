// DO NOT rename this file to servers.svelte.ts, it will not load it into client-side code because it contains the word "server" in the filename.

import { browser } from "$app/environment"

export let API_ROOT = `${browser ? location.protocol : "https"}//${
	browser ?
		location.hostname == "localhost" ? "10.10.99.1" : location.hostname
		: "10.10.99.1"
}/api/`;

let servers = $state([
	{
		name: "Local",
		domain: browser ? location.hostname == "localhost" ? "10.10.99.1" : location.hostname : "10.10.99.1"
	}
]);

export function getServers() {
	return servers;
}

export function loadServers() {
	let storedServers = localStorage.getItem("servers");
	if(storedServers) {
		servers = JSON.parse(storedServers);
	}
}

export function saveServers() {
	localStorage.setItem("servers", JSON.stringify(servers));
}

export function useServer(domain: string) {
	API_ROOT = `${browser ? location.protocol : "https"}://${domain}/api/`;
}
