<script lang="ts">
	import * as Dialog from "./ui/dialog";
	import * as Tabs from "./ui/tabs";
	import YAML from "yaml";
	import TOML from "smol-toml";
    import ScrollArea from "./ui/scroll-area/scroll-area.svelte";

	let {
		open = $bindable(),
		data,
		title,
		defaultFormat
	}: {
		open: boolean,
		data: any,
		title: string,
		defaultFormat: "json" | "toml" | "yaml"
	} = $props();

	function tryTOML(data: any) {
		try {
			return TOML.stringify(data);
		} catch {
			return "(unable to serialize)";
		}
	}
</script>

<Dialog.Root bind:open={open}>
  <Dialog.Content class="max-w-5xl max-h-[48rem]">
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>
				<Tabs.Root value={defaultFormat}>
					<Tabs.List>
						<Tabs.Trigger value="json">JSON</Tabs.Trigger>
						<Tabs.Trigger value="toml">TOML</Tabs.Trigger>
						<Tabs.Trigger value="yaml">YAML</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="json">
						<ScrollArea orientation="both" class="max-w-[calc(64rem-3rem)] pb-2 max-h-[40rem] h-[40rem]">
							<pre class="overflow-scroll">{JSON.stringify(data, null, 2)}</pre>
						</ScrollArea>
					</Tabs.Content>
					<Tabs.Content value="toml">
						<ScrollArea orientation="both" class="max-w-[calc(64rem-3rem)] pb-2 max-h-[40rem] h-[40rem]">
							<pre class="overflow-scroll">{tryTOML(data)}</pre>
						</ScrollArea>
					</Tabs.Content>
					<Tabs.Content value="yaml">
						<ScrollArea orientation="both" class="max-w-[calc(64rem-3rem)] pb-2 max-h-[40rem] h-[40rem]">
							<pre class="overflow-scroll">{YAML.stringify(data)}</pre>
						</ScrollArea>
					</Tabs.Content>
				</Tabs.Root>
      </Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>