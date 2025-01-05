<script lang="ts">
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import Plus from "lucide-svelte/icons/plus";
	import { useSidebar } from "./ui/sidebar";
	import * as Sidebar from "./ui/sidebar";
	import * as DropdownMenu from "./ui/dropdown-menu";
	import { ShieldIcon } from "lucide-svelte";
	import { useServer } from "$lib/routers.svelte";

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { servers }: { servers: { name: string; domain: string }[] } = $props();

	let activeServer = $state(servers[0]);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Sidebar.MenuButton
				{...props}
				size="lg"
				class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				<div
					class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
				>
					<ShieldIcon class="size-4" />
				</div>
				<div class="grid flex-1 text-left text-sm leading-tight">
					<span class="truncate font-semibold">
						{activeServer.name}
					</span>
					<span class="truncate text-xs">{activeServer.domain}</span>
				</div>
				<ChevronsUpDown class="ml-auto" />
			</Sidebar.MenuButton>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
		align="start"
		side="top"
		sideOffset={4}
	>
		<DropdownMenu.Label class="text-muted-foreground text-xs">Servers</DropdownMenu.Label>
		{#each servers as server, index (server.name)}
			<DropdownMenu.Item onSelect={() => (activeServer = server)} class="gap-2 p-2">
				<div class="flex size-6 items-center justify-center rounded-sm border">
					<ShieldIcon class="size-4 shrink-0" />
				</div>
				{server.name}
			</DropdownMenu.Item>
		{/each}
		<DropdownMenu.Separator />
		<!-- <DropdownMenu.Item class="gap-2 p-2">
			<div
				class="bg-background flex size-6 items-center justify-center rounded-md border"
			>
				<Plus class="size-4" />
			</div>
			<div class="text-muted-foreground font-medium">Add server</div>
		</DropdownMenu.Item> -->
		<DropdownMenu.Item class="gap-2 p-2" onclick={() => {
			let domain = prompt("Enter server domain");
			if(domain) {
				useServer(domain);
				activeServer = { name: domain, domain };
			}
		}}>
			<div
				class="bg-background flex size-6 items-center justify-center rounded-md border"
			>
				<Plus class="size-4" />
			</div>
			<div class="text-muted-foreground font-medium">Custom</div>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
