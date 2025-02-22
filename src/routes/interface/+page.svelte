<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import Input from "$lib/components/ui/input/input.svelte";
	import { IPv4AddressInput } from "$lib/components/ui/ipv4address-input";
	import { Label } from "$lib/components/ui/label";
	import * as Select from "$lib/components/ui/select";
	import * as Dialog from "$lib/components/ui/dialog";
	import { onMount } from "svelte";
	import {
		fetchNetwork,
		getNetwork,
		patchNetwork,
		reloadNetd,
        token,
	} from "$lib/api.svelte";
	import Devices from "../devices/Devices.svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import Spinner from "$lib/components/ui/Spinner.svelte";
    import { API_ROOT } from "$lib/routers.svelte";

	let iface: {
		type: "ethernet" | "bridge";
		mode: "dhcp" | "static";
		interfaces?: string[];
		address: string;
		netmask: number;
		gateway: string;
		do_failover: boolean;
		depends?: string[];
		dhcp: {
			enabled: boolean;
			start: string;
			end: string;
			dns: string;
			router: string;
		};
	} = $state({
		type: "ethernet",
		mode: "dhcp",
		address: "10.10.99.1",
		netmask: 24,
		gateway: "",
		do_failover: false,
		depends: [],
		dhcp: {
			enabled: false,
			start: "10.10.99.100",
			end: "10.10.99.200",
			dns: "10.10.99.1",
			router: "10.10.99.1",
		},
	});

	$inspect(iface);

	let changed = $state(false);

	$inspect(changed);

	let reloadDialog = $state(false);
	let reloadingDialog = $state(false);
	let reloadingTime = $state(1);

	async function fetchData() {
		await fetchNetwork();
		let ifname = page.url.hash.replace("#", "");
		if (getNetwork().interfaces[ifname] === undefined) {
			goto("/network");
			return;
		}
		iface = { ...iface, ...getNetwork().interfaces[ifname] };
	}

	async function saveData() {
		getNetwork().interfaces[page.url.hash.replace("#", "")] = iface;
		if(getNetwork().interfaces[page.url.hash.replace("#", "")].gateway == "") {
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].gateway;
		}
		if(getNetwork().interfaces[page.url.hash.replace("#", "")].do_failover == false) {
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].do_failover;
		}
		if(getNetwork().interfaces[page.url.hash.replace("#", "")].mode == "dhcp") {
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].address;
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].netmask;
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].gateway;
		}
		if(getNetwork().interfaces[page.url.hash.replace("#", "")].dhcp.enabled == false) {
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].dhcp;
		}
		if(getNetwork().interfaces[page.url.hash.replace("#", "")].depends.length == 0) {
			delete getNetwork().interfaces[page.url.hash.replace("#", "")].depends;
		}
		await patchNetwork();
		reloadDialog = true;
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

	onMount(fetchData);
</script>

<div class="mb-2 mt-2 flex items-center">
	<h1 class="text-2xl">{page.url.hash.replace("#", "")}</h1>
	<Button
		variant="outline"
		class="ml-auto"
		onclick={() => {
			goto("/network");
		}}>Back</Button
	>
</div>

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

<div class="flex flex-col gap-2">
	{#if changed}
		<Card.Root>
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
						await fetchData();
						changed = false;
					}}>Discard</Button
				>
				<Button
					onclick={() => {
						saveData();
						changed = false;
					}}>Save</Button
				>
			</Card.Content>
		</Card.Root>
	{/if}
	<Card.Root>
		<Card.Header>
			<Card.Title>Configuration</Card.Title>
		</Card.Header>
		<Card.Content>
			<Select.Root
				type="single"
				bind:value={iface.type}
				onValueChange={(e) => {
					changed = true;
				}}
			>
				<Select.Trigger>
					{iface.type == "ethernet" ? "Ethernet" : "Bridge"}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="ethernet">Ethernet</Select.Item>
					<Select.Item value="bridge">Bridge</Select.Item>
				</Select.Content>
			</Select.Root>

			{#if iface.type == "bridge"}
				<!-- <Select.Root type="multiple" bind:value={iface.interfaces}>
					<Select.Trigger class="mt-2">
						{(iface.interfaces || []).length == 0 ? "No interfaces" : (iface.interfaces || []).join(", ")}
					</Select.Trigger>
					<Select.Content>
						{#each Object.keys(getNetwork().interfaces) as ifaceName}
							{@const iface = getNetwork().interfaces[ifaceName]}
							{#if iface.type == "ethernet"}
								<Select.Item value={ifaceName}>{ifaceName}</Select.Item>
							{/if}
						{/each}
					</Select.Content>
				</Select.Root> -->
			{/if}

			<Select.Root
				type="single"
				bind:value={iface.mode}
				onValueChange={(e) => {
					changed = true;
				}}
			>
				<Select.Trigger class="mt-2">
					{iface.mode == "dhcp" ? "DHCP" : "Static"}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="dhcp">DHCP</Select.Item>
					<Select.Item value="static">Static</Select.Item>
				</Select.Content>
			</Select.Root>

			{#if iface.mode == "static"}
				<div class="flex flex-col mt-2">
					<div class="flex gap-2 items-center">
						<span>Address: &nbsp;</span>
						<IPv4AddressInput
							bind:value={iface.address}
							onchange={(e) => {
								changed = true;
							}}
						/>
						<span>/</span>
						<Input
							type="number"
							bind:value={iface.netmask}
							class="w-[8ch]"
							maxlength={2}
							onchange={(e) => {
								changed = true;
							}}
						/>
					</div>
				</div>
				<div class="flex flex-col mt-2">
					<div class="flex gap-2 items-center">
						<span>Gateway:&nbsp;</span>
						<IPv4AddressInput
							bind:value={iface.gateway}
							onchange={(e) => {
								changed = true;
							}}
						/>
					</div>
				</div>
			{/if}
			<div class="flex items-center space-x-2 mt-2">
				<Checkbox
					id="failover"
					bind:checked={iface.do_failover}
					aria-labelledby="failover-label"
					onCheckedChange={(e) => {
						changed = true;
					}}
				/>
				<Label
					id="failover-label"
					for="failover"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Enable failover
				</Label>
			</div>

			<div class="flex items-center space-x-2 mt-2">
				<Label
					id="depends-label"
					for="depends"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-20"
				>
					Depends on
				</Label>
				<Select.Root type="multiple" bind:value={iface.depends} onValueChange={(e) => {
					changed = true;
				}}>
					<Select.Trigger class="mt-2" id="depends">
						{(iface.depends || []).length == 0 ? "No depends" : (iface.depends || []).join(", ")}
					</Select.Trigger>
					<Select.Content>
						{#each Object.keys(getNetwork().interfaces) as ifaceName}
							{@const iface = getNetwork().interfaces[ifaceName]}
							{#if ifaceName != page.url.hash.replace("#", "")}
								<Select.Item value={ifaceName}>{ifaceName}</Select.Item>
							{/if}
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<Dialog.Root>
				<Dialog.Trigger>
					<Button class="mt-2" variant="secondary">DHCP Server</Button>
				</Dialog.Trigger>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title
							>DHCP Server on {page.url.hash.replace("#", "")}</Dialog.Title
						>
						<Dialog.Description
							>Configure the DHCP Server for this interface.</Dialog.Description
						>
					</Dialog.Header>
					<!-- <div class="flex flex-col gap-2">
						<div class="flex gap-2 items-center">
							<span>Start IP: &nbsp;</span>
							<IPv4AddressInput bind:value={iface.dhcp.start} />
						</div>
						<div class="flex gap-2 items-center">
							<span>End IP: &nbsp;</span>
							<IPv4AddressInput bind:value={iface.dhcp.end} />
						</div>
						<div class="flex gap-2 items-center">
							<span>DNS: &nbsp;</span>
							<IPv4AddressInput bind:value={iface.dhcp.dns} />
						</div>
						<div class="flex gap-2 items-center">
							<span>Router: &nbsp;</span>
							<IPv4AddressInput bind:value={iface.dhcp.router} />
						</div>
					</div> -->
					<div class="grid grid-cols-2 gap-2">
						<Label
							id="dhcp-label"
							for="dhcp"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Enable DHCP Server
						</Label>
						<Checkbox
							id="dhcp"
							bind:checked={iface.dhcp.enabled}
							aria-labelledby="dhcp-label"
							onCheckedChange={(e) => {
								changed = true;
							}}
						/>
						{#if iface.dhcp.enabled}
							<span>Start IP: &nbsp;</span>
							<IPv4AddressInput
								bind:value={iface.dhcp.start}
								onchange={(e) => {
									changed = true;
								}}
							/>
							<span>End IP: &nbsp;</span>
							<IPv4AddressInput
								bind:value={iface.dhcp.end}
								onchange={(e) => {
									changed = true;
								}}
							/>
							<span>DNS: &nbsp;</span>
							<IPv4AddressInput
								bind:value={iface.dhcp.dns}
								onchange={(e) => {
									changed = true;
								}}
							/>
							<span>Router: &nbsp;</span>
							<IPv4AddressInput
								bind:value={iface.dhcp.router}
								onchange={(e) => {
									changed = true;
								}}
							/>
						{/if}
					</div>
				</Dialog.Content>
			</Dialog.Root>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Devices</Card.Title>
		</Card.Header>
		<Card.Content>
			<Devices />
		</Card.Content>
	</Card.Root>
</div>
