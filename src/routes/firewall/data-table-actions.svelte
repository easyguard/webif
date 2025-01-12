<script lang="ts">
	import Ellipsis from "lucide-svelte/icons/ellipsis";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { deleteRule } from "$lib/api.svelte";

	let { id, fromZone, toZone }: { id: string, fromZone: string, toZone: string } = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				class="relative size-8 p-0"
			>
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item>Edit</DropdownMenu.Item>
		<DropdownMenu.Item onclick={async () => {
			await deleteRule(fromZone, toZone, {
				port: id.split("/")[1] == "icmp" ? 0 : parseInt(id.split("/")[0]),
				protocol: id.split("/")[1],
				type: id.split("/")[1] == "icmp" ? id.split("/")[0] : "",
				limit: "",
				ip: null
			});
		}}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
