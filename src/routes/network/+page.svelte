<script lang="ts">
	import { goto } from "$app/navigation";
	import { fetchNetwork, getNetwork, patchNetwork, reloadNetd, token } from "$lib/api.svelte";
	import InspectorContextMenu from "$lib/components/InspectorContextMenu.svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Input } from "$lib/components/ui/input";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { API_ROOT } from "$lib/routers.svelte";
	import {
		ChevronsLeftRightEllipsisIcon,
		EthernetPortIcon,
	} from "lucide-svelte";
    import { toast } from "svelte-sonner";

	$effect(() => {
		fetchNetwork();
	});

	let changed = $state(false);

	$inspect(changed);

	let renameDialog = $state(false);
	let fromName = $state("");
	let toName = $state("");
	let reloadDialog = $state(false);
	let reloadingDialog = $state(false);
	let reloadingTime = $state(1);

	async function saveData() {
		console.log("Saving data");
		await patchNetwork();
	}

	function rename() {
		/*
		[renames]
eth0 = "wan"
eth1 = "lan1"
eth2 = "guest"
		*/
		// Check if to name already exists
		if (Object.keys(getNetwork().interfaces).includes(toName)) {
			toast.error("Interface with that name already exists");
			return;
		}
		if (toName == "") {
			if (Object.keys(getNetwork().interfaces).includes(fromName)) {
				toast.error("Interface with that name exists!");
				return;
			}
			delete getNetwork().renames[fromName];
		} else {
			// if a rename exists for something = fromName, update the rename
			if (Object.values(getNetwork().renames).includes(fromName)) {
				for (let [key, value] of Object.entries(getNetwork().renames)) {
					if (value == fromName) {
						getNetwork().renames[key] = toName;
					}
				}

				if (Object.keys(getNetwork().interfaces).includes(fromName)) {
					getNetwork().interfaces[toName] = getNetwork().interfaces[fromName];
					delete getNetwork().interfaces[fromName];
				}
			} else {
				getNetwork().renames[fromName] = toName;
				if (Object.keys(getNetwork().interfaces).includes(fromName)) {
					getNetwork().interfaces[toName] = getNetwork().interfaces[fromName];
					delete getNetwork().interfaces[fromName];
				}
			}
		}
		renameDialog = false;
		changed = true;
	}

	async function reloadConfig() {
		reloadingDialog = true;
		reloadDialog = false;
		reloadingTime = 1;
		let interval = setInterval(async () => {
			reloadingTime++;
			if(reloadingTime % 2 == 0) {
				try {
					const res = await fetch(API_ROOT + "ping", {
						headers: {
							"Authorization": token.token
						}
					});
					clearInterval(interval);
					reloadingDialog = false;
				} catch {
					// ignore, just keep waiting
				}
			}
		}, 1000);
		await reloadNetd();
	}
</script>

<Dialog.Root bind:open={renameDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Rename Interface</Dialog.Title>
			<Dialog.Description>
				This will rename a network interface to a human-readable name.
			</Dialog.Description>
		</Dialog.Header>
		<Input placeholder="From" bind:value={fromName} />
		<Input placeholder="To" bind:value={toName} />
		<Dialog.Footer>
			<Button
				type="submit"
				onclick={async () => {
					rename();
				}}>Rename</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={reloadDialog}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Reload configuration?</AlertDialog.Title>
			<AlertDialog.Description>
				Your configuration has been saved. Do you want to reload and apply the
				new configuration?
				<b
					>This will temporarily disconnect all interfaces and WILL cause a
					short downtime!</b
				>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>No</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={async () => {
					await reloadConfig();
				}}>Reload now</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={reloadingDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Configuration is reloading</Dialog.Title>
			<Dialog.Description>
				The new configuration is being applied. This may take a few seconds.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex gap-4 items-center justify-center flex-col">
			<Spinner />
			<span class="text-2xl">{reloadingTime}s</span>
		</div>
	</Dialog.Content>
</Dialog.Root>

{#if getNetwork() == null}
	<Skeleton class="w-full h-96" />
{:else}
	<InspectorContextMenu
		data={getNetwork()}
		title="Raw Network"
		defaultFormat="toml"
	>
		{#if changed}
			<Card.Root class="mb-2">
				<Card.Header>
					<Card.Title>Changes</Card.Title>
					<Card.Description
						>Changes have been made that have not been saved yet.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<Button
						variant="secondary"
						onclick={async () => {
							await fetchNetwork();
							changed = false;
						}}>Discard</Button
					>
					<Button
						onclick={() => {
							saveData();
							reloadDialog = true;
							changed = false;
						}}>Save</Button
					>
				</Card.Content>
			</Card.Root>
		{/if}
		<Card.Root class="mb-2">
			<Card.Header>
				<Card.Title>Renames</Card.Title>
				<Card.Description
					>Renaming interfaces to human-readable names</Card.Description
				>
			</Card.Header>
			<Card.Content>
				{#if getNetwork().renames == undefined}
					No renames
				{:else}
					{#each Object.keys(getNetwork().renames) as ifaceName}
						<code>{ifaceName}</code> →
						<code>{getNetwork().renames[ifaceName]}</code>
						<br />
					{/each}
				{/if}
				<Button class="mt-2" variant="secondary" onclick={() => {
					renameDialog = true;
				}}
					>Rename Interface</Button
				>
			</Card.Content>
		</Card.Root>
		<div class="flex flex-wrap gap-2">
			{#each Object.keys(getNetwork().interfaces) as ifaceName}
				{@const iface = getNetwork().interfaces[ifaceName]}
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							{#if iface.type === undefined || iface.type === "ethernet"}
								<EthernetPortIcon />
							{:else if iface.type === "bridge"}
								<ChevronsLeftRightEllipsisIcon />
							{/if}
							{ifaceName}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						{iface.mode == "dhcp" ? "DHCP" : "Static"}{iface.mode == "static"
							? ": " + iface.address + "/" + iface.netmask
							: ""}
						<br />
						{iface.do_failover ? "With Failover" : "-"}
						<br />
						{iface.dhcp ? "Has DHCP Server" : "-"}
					</Card.Content>
					<Card.Footer>
						<Button
							variant="secondary"
							onclick={() => {
								goto(`/interface#${ifaceName}`);
							}}>View</Button
						>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</InspectorContextMenu>
{/if}
