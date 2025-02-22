import YAML from "yaml";
import TOML from "smol-toml";
import { EventSource } from "eventsource";
import { API_ROOT } from "./routers.svelte";
import { toast } from "svelte-sonner";

let firewall: null | {
	zones: {
		name: string,
		input: FirewallChain,
		output: FirewallChain
		forward: ({
			dest: string
		} & FirewallChain)[]
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

export function catchHandler(e: any) {
	console.error(e);
	toast.error(e.message || e);
}

export function fetchEnsureSuccess(res: Response | void) {
	if(!res) {
		throw new Error("No response");
	}
	if(!res.ok) {
		throw new Error(res.statusText);
	}
	return res;
}

export function getFirewall() {
	return firewall;
}

export async function fetchFirewall() {
	let res = await fetch(API_ROOT + "firewall", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!res) return;
	await res.json()
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
	let type = newRule.type;

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
		zone, chain, rule: {protocol, port, type}
		})
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler)
		.then(async res => {
			openChanges.changes++;
			openChanges.changesList.push(`Added rule from ${fromZone} to ${toZone} with protocol ${protocol} and port ${port || type}`);
			await fetchFirewall();
		})
}

export function deleteRule(fromZone: string, toZone: string, rule: FirewallRule) {
	let zone = fromZone;
	let chain = toZone;
	let protocol = rule.protocol;
	let port = rule.port;
	let type = rule.type;

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
		zone, chain, rule: {protocol, port, type}
		})
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler)
		.then(async res => {
			openChanges.changes++;
			openChanges.changesList.push(`Deleted rule from ${fromZone} to ${toZone} with protocol ${protocol} and port ${port || type}`);
			await fetchFirewall();
		})
}

export async function fetchDNS() {
	let _dns = await fetch(API_ROOT + "dns", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!_dns) return;
	dns = YAML.parse(await _dns.text());
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
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);

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
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
}

export async function fetchNetwork() {
	let _network = await fetch(API_ROOT + "network", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!_network) return;
	network = TOML.parse(await _network.text());
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
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);

	openChanges.changes++;
	openChanges.changesList.push("Updated network settings");
}

export async function getIP() {
	let ip = await fetch(API_ROOT + "ip", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!ip) return;
	return await ip.text();
}

export async function getLink() {
	let link = await fetch(API_ROOT + "link", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!link) return;
	return await link.text();
}

export async function getRoute() {
	let route = await fetch(API_ROOT + "route", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!route) return;
	return await route.text();
}

export async function ping(host: string) {
	let ping = await fetch(API_ROOT + "ping/" + host, {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!ping) return;
	return await ping.text();
}

export async function traceroute(host: string) {
	let traceroute = await fetch(API_ROOT + "traceroute/" + host, {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!traceroute) return;
	return await traceroute.text();
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
			})
	});

	return events;
}

export async function apk(command: string) {
	let apk = await fetch(API_ROOT + "apk", {
		method: "POST",
		headers: {
			"Content-Type": "text/plain",
			"Authorization": token.token
		},
		body: command
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!apk) return;
	return await apk.text();
}

export async function getWorld() {
	let world = await fetch(API_ROOT + "world", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!world) return;
	return await world.text();
}

export async function getTemplates() {
	let templates = await fetch(API_ROOT + "firewall/templates", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!templates) return;
	return templates.json();
}

export async function getTemplate(template: string) {
	let templateJson = await fetch(API_ROOT + "firewall/template/" + template, {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!templateJson) return;
	return await templateJson.json();
}

export async function patchTemplate(template: string, data: string) {
	let res = await fetch(API_ROOT + "firewall/template/" + template, {
		method: "PATCH",
		headers: {
			"Authorization": token.token
		},
		body: data
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!res) return;
	return await res.json();
}

export async function deleteTemplate(template: string) {
	let res = await fetch(API_ROOT + "firewall/template/" + template, {
		method: "DELETE",
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!res) return;
	return await res.json();
}

export async function createTemplate(template: string) {
	let res = await fetch(API_ROOT + "firewall/template/" + template, {
		method: "PUT",
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!res) return;
	return await res.json();
}

export async function patchIncludes(zone: string, chain: string, includes: string[]) {
	let res = await fetch(API_ROOT + "firewall/includes", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			"Authorization": token.token
		},
		body: JSON.stringify({
			zone, chain, includes
		})
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!res) return;
	openChanges.changes++;
	openChanges.changesList.push(`Updated includes for ${zone} ${chain}`);
	await fetchFirewall();
}

export type Alias = {
	mac: string,
	name: string
}

export async function getAliases() {
	const res = await fetch(API_ROOT + "aliases", {
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
	if(!res) return;
	const raw = await res.text();
	return raw.trim().split("\n").map(line => {
		const [mac, name] = line.split("\t");
		return {mac, name};
	});
}

export async function patchAliases(aliases: Alias[]) {
	const data = aliases.map(alias => `${alias.mac}\t${alias.name}`).join("\n");
	await fetch(API_ROOT + "aliases", {
		method: "PATCH",
		headers: {
			"Content-Type": "text/plain",
			"Authorization": token.token
		},
		body: data
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
}

export async function reloadNetd() {
	await fetch(API_ROOT + "netd/reload", {
		method: "POST",
		headers: {
			"Authorization": token.token
		}
	})
		.catch(catchHandler)
		.then(fetchEnsureSuccess)
		.catch(catchHandler);
}
