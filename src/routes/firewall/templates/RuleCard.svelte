<script lang="ts">
	import * as Drawer from "$lib/components/ui/drawer";
	import type { Snippet } from "svelte";
	import { getColumns } from "../columns";
	import DataTable from "../data-table.svelte";
	import TableContextMenu from "../table-context-menu.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { getTemplate, patchTemplate } from "$lib/api.svelte";
	import * as Card from "$lib/components/ui/card";
	import { getRules } from "$lib/TemplateManager.svelte";

	let { template, rules, close }: { template: string, rules: FirewallRule[], close: () => void } = $props();

	let showTable = $state(true);

	$inspect(showTable);

	// once rules change, change showTable to false and change it back after a frame
	// this is super hacky but i have been trying to get this working for ages
	// BEGONE!
	$effect(() => {
		console.log("Rules changed", $state.snapshot(rules))
		showTable = false;
		requestAnimationFrame(() => {
			showTable = true;
		});
	})

	// $inspect()
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{template}</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if showTable}
			<TableContextMenu zone={rules}>
				<DataTable columns={getColumns("$$template$$", template)} data={rules} fromZone={"$$template$$"} toZone={template} />
			</TableContextMenu>
		{/if}
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full gap-2">
			<Button variant="secondary" class="flex-1" onclick={() => {
				close();
			}}>Discard</Button>
			<Button class="flex-1" onclick={async () => {
				console.log("Saving rules for template", template);
				await patchTemplate(template, JSON.stringify(getRules(), null, 2));
				close();
			}}>Save</Button>
		</div>
	</Card.Footer>
</Card.Root>