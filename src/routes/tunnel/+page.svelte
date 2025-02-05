<script lang="ts">
	import { goto } from "$app/navigation";
	import { getWorld } from "$lib/api.svelte";
	import * as Alert from "$lib/components/ui/alert";
	import Button from "$lib/components/ui/button/button.svelte";
	import { MonitorDownIcon } from "lucide-svelte";
	import { onMount } from "svelte";

	async function isInstalled(name: string) {
		const world = await getWorld();
		return world.includes(name + "\n");
	}

	let hasWireGuard = false;
	let hasTailscale = false;

	onMount(async () => {
		hasWireGuard = await isInstalled("wireguard-tools-wg-quick");
		hasTailscale = await isInstalled("tailscale");
	})
</script>

{#if !(hasWireGuard || hasTailscale)}
	<Alert.Root>
		<MonitorDownIcon class="h-4 w-4" />
		<Alert.Title>Required module missing</Alert.Title>
		<Alert.Description class="flex flex-col">
			A VPN module is required for this.
			<Button class="mt-4 w-min" onclick={() => { goto("/modules"); }}>Browse modules</Button>
		</Alert.Description>
	</Alert.Root>
{:else}
	{#if hasWireGuard}
		
	{/if}
{/if}