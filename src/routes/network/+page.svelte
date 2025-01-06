<script lang="ts">
    import { goto } from "$app/navigation";
	import { fetchNetwork, getNetwork } from "$lib/api.svelte";
	import InspectorContextMenu from "$lib/components/InspectorContextMenu.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { ChevronsLeftRightEllipsisIcon, EthernetPortIcon } from "lucide-svelte";

	$effect(() => {
		fetchNetwork();
	})

	let changed = $state(false);

	$inspect(changed);
</script>

{#if getNetwork() == null}
	<Skeleton class="w-full h-96" />
{:else}
	<InspectorContextMenu data={getNetwork()} title="Raw Network" defaultFormat="toml">
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
						{iface.mode} {iface.address} {iface.netmask}
						<br>
						{iface.do_failover ? "With Failover" : "-"}
						<br>
						{iface.dhcp ? "Has DHCP Server" : "-"}
					</Card.Content>
					<Card.Footer>
						<Button variant="secondary" onclick={() => {
							goto(`/devices#${ifaceName}`);
						}}>Devices</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</InspectorContextMenu>
{/if}