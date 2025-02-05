<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { fetchFirewall, getFirewall, getTemplates, patchIncludes } from "$lib/api.svelte";
	import DataTable from "./data-table.svelte";
	import { getColumns } from "./columns";
	import TableContextMenu from "./table-context-menu.svelte";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Card from "$lib/components/ui/card";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import FirewallRules from "./rules/FirewallRules.svelte";
	import Templates from "./templates/Templates.svelte";

	$effect(() => {
		fetchFirewall();
	})
</script>

<Tabs.Root value="rules">
	<Tabs.List class="w-full">
		<Tabs.Trigger value="zones" disabled>Zones</Tabs.Trigger>
		<Tabs.Trigger value="rules">Rules</Tabs.Trigger>
		<Tabs.Trigger value="templates">Templates</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="rules">
		<FirewallRules />
	</Tabs.Content>
	<Tabs.Content value="templates">
		<Templates />
	</Tabs.Content>
</Tabs.Root>

<!-- <Select.Root type="multiple">
	<Select.Trigger class="w-[180px]">
		{}
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="A">A</Select.Item>
		<Select.Item value="B">B</Select.Item>
		<Select.Item value="C">D</Select.Item>
	</Select.Content>
</Select.Root> -->