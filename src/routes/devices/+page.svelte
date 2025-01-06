<script lang="ts">
	import { page } from "$app/state";
	import { getDevices } from "$lib/api.svelte";
	import InspectorContextMenu from "$lib/components/InspectorContextMenu.svelte";
	import * as Card from "$lib/components/ui/card";
	import { BookUserIcon, ComputerIcon, FactoryIcon, MapPinnedIcon, TagIcon } from "lucide-svelte";
	import { onMount } from "svelte";

	let devices: {
		ipv4: string,
		mac: string,
		hostname: string | null,
		vendor: string | null
	}[] = $state([]);
	let loading = $state(true);

	onMount(() => {
		let events = getDevices(page.url.hash.replace("#", ""));
		events.addEventListener("message", (e) => {
			const json = JSON.parse(e.data);
			console.log(json);
			if(json.packet_count) {
				console.log("Closing event source");
				events.close();
				loading = false;
				return;
			}
			if(devices.findIndex((x) => x.ipv4 === json.ipv4) === -1) {
				devices.push(json);
			} else {
				devices[devices.findIndex((x) => x.ipv4 === json.ipv4)] = json;
			}
		})
	})
</script>

{#if loading}
	<span>Loading...</span>
{/if}

<h1 class="text-2xl mb-2">Devices on {page.url.hash.replace("#", "")}</h1>
<InspectorContextMenu data={devices} defaultFormat="json" title="Raw Devices">
	<div id="devices" class="flex gap-2 flex-wrap">
		{#each devices as device}
			<Card.Root>
				<Card.Header class="flex-row gap-2 items-center">
					<ComputerIcon size="40" />
					<span class="text-lg">
						{#if device.hostname}
							{device.hostname}
						{:else}
							{device.ipv4}
						{/if}
					</span>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					<div class="info">
						<BookUserIcon />
						<span>{device.ipv4}</span>
					</div>
					<div class="info">
						<MapPinnedIcon />
						<span>{device.mac}</span>
					</div>
					<div class="info">
						<TagIcon />
						<span>{device.hostname || "(unknown)"}</span>
					</div>
					<div class="info">
						<FactoryIcon />
						<span>{device.vendor || "(unknown)"}</span>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</InspectorContextMenu>

<style>
	.info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>