<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as Select from "$lib/components/ui/select";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { fetchFirewall, getFirewall } from "$lib/api.svelte";
	import DataTable from "./data-table.svelte";
	import { getColumns } from "./columns";
	import TableContextMenu from "./table-context-menu.svelte";

	let fromZone = $state("");
	let toZone = $state("");

	function zoneToFriendlyName(zone: string) {
		switch (zone) {
			case "lan":
				return "Local";
			case "wan":
				return "Internet";
			case "guest":
				return "Guest";
			default:
				return zone;
		}
	}

	function getZone(fromZone: string, toZone: string): null | FirewallRule[] {
		console.log("getZone", fromZone, toZone);

		let firewall = getFirewall();
		if(firewall == null) {
			console.log("Firewall not loaded.");
			return null;
		}

		if(fromZone == "" || toZone == "") {
			console.log("Zones not selected.");
			return null;
		}

		if(fromZone == "easyguard") {
			return firewall.zones.find(zone => zone.name == toZone)?.output?.ports || null;
		} else if(toZone == "easyguard") {
			return firewall.zones.find(zone => zone.name == fromZone)?.input?.ports || null;
		} else {
			return firewall.zones.find(zone => zone.name == fromZone)?.forward.find(f => f.dest == toZone)?.ports || null;
		}
	}

	let friendlyFromZone = $derived(fromZone == "" ? "---" : zoneToFriendlyName(fromZone));
	let friendlyToZone = $derived(toZone == "" ? "---" : zoneToFriendlyName(toZone));

	/// false = no data
	/// true = loading
	/// FirewallRule[] = data
	// let zoneData: FirewallRule[] | boolean = $state(false);
	// $effect(() => {
	// 	zoneData = true;
	// 	getZone(fromZone, toZone).then(data => {
	// 		zoneData = data;
	// 	});
	// });
	let zoneData = $derived(getZone(fromZone, toZone));

	$effect(() => {
		fetchFirewall();
	})
</script>

<div class="flex items-center gap-4">
	<Select.Root type="single" bind:value={fromZone}>
		<Select.Trigger>{friendlyFromZone}</Select.Trigger>
		<Select.Content>
			<!-- <Select.Item value="lan">{zoneToFriendlyName("lan")}</Select.Item>
			<Select.Item value="wan">{zoneToFriendlyName("wan")}</Select.Item>
			<Select.Item value="guest">{zoneToFriendlyName("guest")}</Select.Item> -->
			{#each getFirewall()?.zones ?? [] as zone}
				<Select.Item value={zone.name}>{zoneToFriendlyName(zone.name)}</Select.Item>
			{/each}
			<!-- <Select.Item value="output">EasyGuard</Select.Item> -->
		</Select.Content>
	</Select.Root>
	<span>to</span>
	<Select.Root type="single" bind:value={toZone}>
		<Select.Trigger>{friendlyToZone}</Select.Trigger>
		<Select.Content>
			<!-- <Select.Item value="lan">{zoneToFriendlyName("lan")}</Select.Item>
			<Select.Item value="wan">{zoneToFriendlyName("wan")}</Select.Item>
			<Select.Item value="guest">{zoneToFriendlyName("guest")}</Select.Item> -->
			{#each getFirewall()?.zones ?? [] as zone}
				<Select.Item value={zone.name}>{zoneToFriendlyName(zone.name)}</Select.Item>
			{/each}
			<Select.Item value="easyguard">EasyGuard</Select.Item>
		</Select.Content>
	</Select.Root>
</div>
<div class="mt-2">
	{#if fromZone == "" || toZone == ""}
		<p>Please select the zones to display the rules.</p>
		<p>Important Routes:</p>
		<Button onclick={() => {
			fromZone = "lan";
			toZone = "wan";
		}} variant="secondary">Local to Internet</Button>
	{:else}
		{#if getFirewall() == null}
			<Skeleton class="w-full h-96" />
		{:else}
			{#if zoneData == null}
				<span>No data.</span>
			{:else}
				<TableContextMenu zone={zoneData}>
					<DataTable columns={getColumns(fromZone, toZone)} data={zoneData} {fromZone} {toZone} />
				</TableContextMenu>
			{/if}
		{/if}
	{/if}
</div>