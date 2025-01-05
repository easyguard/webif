import YAML from "yaml";
import TOML from "smol-toml";
import { EventSource } from "eventsource";
import { API_ROOT } from "./routers.svelte";

let firewall: null | {
	zones: {
		name: string,
		input: { ports: FirewallRule[] },
		output: { ports: FirewallRule[] },
		forward: {
			dest: string,
			ports: FirewallRule[]
		}[]
	}[]
} = $state(null);
let dns: null | any = $state(null);
let network: null | any = $state(null);

export let openChanges: {
	changes: number,
	changesList: string[]
} = $state({
	changes: 0,
	changesList: []
});

export let token = $state({
	token: ""
});

export function getFirewall() {
	return firewall;
}

export async function fetchFirewall() {
	await fetch(API_ROOT + "firewall", {
		headers: {
			"Authorization": token.token
		}
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			// outgoingRules = data.ports.outgoing;
			firewall = data;
		});
}

export function addRule(fromZone: string, toZone: string, newRule: FirewallRule) {
	let zone = fromZone;
	let chain = toZone;
	let protocol = newRule.protocol;
	let port = newRule.port;

	if(fromZone == "easyguard") {
		zone = toZone;
		chain = "output";
	} else if(toZone == "easyguard") {
		zone = fromZone;
		chain = "input";
	}

	fetch(API_ROOT + "firewall/rule", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"Authorization": token.token
		},
		body: JSON.stringify({
		zone, chain, rule: {protocol, port}
		})
	}).then(async res => {
		openChanges.changes++;
		openChanges.changesList.push(`Added rule from ${fromZone} to ${toZone} with protocol ${protocol} and port ${port}`);
		await fetchFirewall();
	})
}

export function deleteRule(fromZone: string, toZone: string, rule: FirewallRule) {
	let zone = fromZone;
	let chain = toZone;
	let protocol = rule.protocol;
	let port = rule.port;

	if(fromZone == "easyguard") {
		zone = toZone;
		chain = "output";
	} else if(toZone == "easyguard") {
		zone = fromZone;
		chain = "input";
	}

	fetch(API_ROOT + "firewall/rule", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"Authorization": token.token
		},
		body: JSON.stringify({
		zone, chain, rule: {protocol, port}
		})
	}).then(async res => {
		openChanges.changes++;
		openChanges.changesList.push(`Deleted rule from ${fromZone} to ${toZone} with protocol ${protocol} and port ${port}`);
		await fetchFirewall();
	})
}

export async function fetchDNS() {
	dns = YAML.parse(await fetch(API_ROOT + "dns", {
		headers: {
			"Authorization": token.token
		}
	})
	.then(response => response.text()))
}

export function getDNS() {
	return dns;
}

export async function patchDNS() {
	await fetch(API_ROOT + "dns", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/x-yaml",
			"Authorization": token.token
		},
		body: YAML.stringify(dns)
	})

	openChanges.changes++;
	openChanges.changesList.push("Updated DNS settings");
}

export async function commit() {
	openChanges.changes = 0;
	openChanges.changesList = [];

	return fetch(API_ROOT + "commit", {
		method: "POST",
		headers: {
			"Authorization": token.token
		}
	})
}

export async function fetchNetwork() {
	network = TOML.parse(await fetch(API_ROOT + "network", {
		headers: {
			"Authorization": token.token
		}
	})
	.then(response => response.text()))
}

export function getNetwork() {
	return network;
}

export async function patchNetwork() {
	await fetch(API_ROOT + "network", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/x-yaml",
			"Authorization": token.token
		},
		body: TOML.stringify(network)
	})

	openChanges.changes++;
	openChanges.changesList.push("Updated network settings");
}

export async function getIP() {
	return fetch(API_ROOT + "ip", {
		headers: {
			"Authorization": token.token
		}
	}).then(response => response.text());
}

export async function getLink() {
	return fetch(API_ROOT + "link", {
		headers: {
			"Authorization": token.token
		}
	}).then(response => response.text());
}

export async function getRoute() {
	return fetch(API_ROOT + "route", {
		headers: {
			"Authorization": token.token
		}
	}).then(response => response.text());
}

export async function ping(host: string) {
	return fetch(API_ROOT + "ping/" + host, {
		headers: {
			"Authorization": token.token
		}
	}).then(response => response.text());
}

export async function traceroute(host: string) {
	return fetch(API_ROOT + "traceroute/" + host, {
		headers: {
			"Authorization": token.token
		}
	}).then(response => response.text());
}

export function getDevices(iface: string) {
	const events = new EventSource(API_ROOT + "devices/" + iface, {
		fetch: (input, init) =>
			fetch(input, {
				...init,
				headers: {
					...((init || {headers: []}).headers),
					Authorization: token.token,
				},
			}),
	});

	return events;
}
