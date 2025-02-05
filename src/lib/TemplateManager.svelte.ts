import { getTemplate } from "./api.svelte";

let rules: FirewallRule[] = $state([]);

export function getRules() {
	return rules;
}

export function addTemplateRule(rule: FirewallRule) {
	rules = [...rules, rule];
}

export function deleteTemplateRule(rule: FirewallRule) {
	console.log(rule);
	rules = rules.filter(r => {
		return rule.protocol == "icmp" ? !(r.protocol == rule.protocol && r.type == rule.type)
			: !(r.protocol == rule.protocol && r.port == rule.port);
	});
}

export async function loadRules(template: string) {
	rules = await getTemplate(template);
}