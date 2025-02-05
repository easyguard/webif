<script lang="ts">
	import { getFirewall, getTemplates, patchIncludes } from "$lib/api.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Select from "$lib/components/ui/select";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
	import { getColumns } from "../columns";
	import DataTable from "../data-table.svelte";
	import TableContextMenu from "../table-context-menu.svelte";

	let fromZone = $state("");
	let toZone = $state("");

	function getZone(fromZone: string, toZone: string): null | FirewallChain {
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
			return firewall.zones.find(zone => zone.name == toZone)?.output || null;
		} else if(toZone == "easyguard") {
			return firewall.zones.find(zone => zone.name == fromZone)?.input || null;
		} else {
			return firewall.zones.find(zone => zone.name == fromZone)?.forward.find(f => f.dest == toZone) || null;
		}
	}

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

	let friendlyFromZone = $derived(fromZone == "" ? "---" : zoneToFriendlyName(fromZone));
	let friendlyToZone = $derived(toZone == "" ? "---" : zoneToFriendlyName(toZone));

	let zoneData = $derived(getZone(fromZone, toZone));
	let zoneIncludes = $derived(zoneData?.include || []);

	$inspect(zoneData).with((event, data) => {
		console.log("zoneData", event, data);
	});
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
				<Card.Root class="mb-2">
					<Card.Header>
						<Card.Title>Includes</Card.Title>
						<Card.Description>Templates this zone includes</Card.Description>
					</Card.Header>
					<Card.Content>
						<Select.Root type="multiple" value={zoneIncludes} onValueChange={async data => {
							console.log(data);
							let zone = fromZone;
							let chain = toZone;

							if(fromZone == "easyguard") {
								zone = toZone;
								chain = "output";
							} else if(toZone == "easyguard") {
								zone = fromZone;
								chain = "input";
							}
							await patchIncludes(zone, chain, data);
						}}>
							<Select.Trigger class="w-full">
								{#if zoneIncludes.length == 0}
									<span class="text-gray-500">None</span>
								{:else}
									{#each zoneIncludes as include}
										<Badge variant="secondary">{include}</Badge>
									{/each}
								{/if}
							</Select.Trigger>
							<Select.Content>
								{#await getTemplates()}
									<!-- loading -->
								{:then templates}
									{#each templates.map((t: string) => t.replace(".json", "")) as template}
										<Select.Item value={template}>{template}</Select.Item>
									{/each}
								{/await}
							</Select.Content>
						</Select.Root>
					</Card.Content>
				</Card.Root>
				<TableContextMenu zone={zoneData}>
					<DataTable columns={getColumns(fromZone, toZone)} data={zoneData.ports} {fromZone} {toZone} />
				</TableContextMenu>
			{/if}
		{/if}
	{/if}
</div>