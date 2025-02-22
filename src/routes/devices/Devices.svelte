<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { getAliases, getDevices, patchAliases, type Alias } from "$lib/api.svelte";
	import InspectorContextMenu from "$lib/components/InspectorContextMenu.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import Progressbar from "$lib/components/ui/Progressbar.svelte";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import { BookUserIcon, ClipboardCopyIcon, ComputerIcon, FactoryIcon, MapPinnedIcon, TagIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	let devices: {
		ipv4: string,
		mac: string,
		hostname: string | null,
		vendor: string | null
	}[] = $state([]);
	let loading = $state(true);
	let aliases: Alias[] = $state([]);

	let editing = $state("");
	let showEditDialog = $state(false);
	let newAlias = $state("");

	onMount(async () => {
		console.log("Getting devices");
		aliases = await getAliases() || [];
		let events = getDevices(page.url.hash.replace("#", ""));
		events.addEventListener("message", (e) => {
			const json = JSON.parse(e.data);
			console.log(json);
			if(json.packet_count != undefined) {
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

<Dialog.Root bind:open={showEditDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Alias device</Dialog.Title>
      <Dialog.Description>
				Add a alias to this device. Leave blank to remove alias.
      </Dialog.Description>
    </Dialog.Header>
		<Input id="alias" bind:value={newAlias} class="col-span-3" placeholder="Alias" />
		<Button class="col-span-3" onclick={async () => {
			if(newAlias === "") {
				aliases = aliases.filter((x) => x.mac !== editing);
			} else if(aliases.find((x) => x.mac === editing)) {
				aliases[aliases.findIndex((x) => x.mac === editing)].name = newAlias;
			} else {
				aliases.push({
					mac: editing,
					name: newAlias
				})
			}
			await patchAliases(aliases);
			editing = "";
			newAlias = "";
			showEditDialog = false;
		}}>Save</Button>
  </Dialog.Content>
</Dialog.Root>

{#if loading}
	<Progressbar class="w-[95%]" />
{/if}

<!-- <div class="mb-2 mt-2 flex items-center">
	<h1 class="text-2xl">Devices on {page.url.hash.replace("#", "")}</h1>
	<Button variant="outline" class="ml-auto" onclick={() => {
		goto("/network");
	}}>Back</Button>
</div> -->
<InspectorContextMenu data={devices} defaultFormat="json" title="Raw Devices">
	<div id="devices" class="flex gap-2 flex-wrap {loading ? "mt-4" : ""}">
		{#each devices as device}
			<Card.Root>
				<Card.Header class="flex-row gap-2 items-center">
					<ComputerIcon size="40" />
					<a class="text-lg" href="http://{device.ipv4}" target="_blank">
						{#if aliases.find((x) => x.mac === device.mac)}
							{aliases.find((x) => x.mac === device.mac)!.name}
						{:else if device.hostname}
							{device.hostname}
						{:else}
							{device.ipv4}
						{/if}
					</a>
				</Card.Header>
				<Card.Content class="flex flex-col gap-2">
					<div class="info">
						<BookUserIcon />
						<Tooltip.Root>
							<Tooltip.Trigger>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_missing_attribute -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<a onclick={() => {
									navigator.clipboard.writeText(device.ipv4);
									toast("Copied \"" + device.ipv4 + "\" to clipboard", {
										position: "top-center"
									});
								}}>{device.ipv4}</a>
							</Tooltip.Trigger>
							<Tooltip.Content>
								Click to copy
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<div class="info group">
						<MapPinnedIcon />
						<Tooltip.Root>
							<Tooltip.Trigger>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_missing_attribute -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<a onclick={() => {
									navigator.clipboard.writeText(device.mac);
									toast("Copied \"" + device.mac + "\" to clipboard", {
										position: "top-center"
									});
								}}>{device.mac}</a>
							</Tooltip.Trigger>
							<Tooltip.Content>
								Click to copy
							</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<div class="info">
						<TagIcon />
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_missing_attribute -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_missing_attribute -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<a onclick={() => {
									editing = device.mac;
									newAlias = aliases.find((x) => x.mac === device.mac)?.name || "";
									showEditDialog = true;
								}}>{aliases.find((x) => x.mac === device.mac)?.name || device.hostname || "(unknown)"}</a>
							</Tooltip.Trigger>
							<Tooltip.Content>
								Click to edit alias
							</Tooltip.Content>
						</Tooltip.Root>
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