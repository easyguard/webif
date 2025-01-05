<script>
	import RawInspector from "$lib/components/RawInspector.svelte";
	import * as ContextMenu from "$lib/components/ui/context-menu";
	import * as Dialog from "$lib/components/ui/dialog";

	let { children, zone } = $props();

	let showRaw = $state(false);
</script>

<RawInspector bind:open={showRaw} data={zone} title="Raw Zone" defaultFormat="json" />

<ContextMenu.Root>
  <ContextMenu.Trigger>
		{@render children()}
	</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item onclick={() => {
			showRaw = true;
		}}>View Raw</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>