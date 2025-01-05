<script lang="ts">
	import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
	import Plus from "lucide-svelte/icons/plus";
	import { useSidebar } from "./ui/sidebar";
	import * as Sidebar from "./ui/sidebar";
	import * as DropdownMenu from "./ui/dropdown-menu";
	import { ShieldIcon } from "lucide-svelte";
	import { useServer } from "$lib/routers.svelte";
    import { token } from "$lib/api.svelte";

	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let { servers }: { servers: { name: string; domain: string }[] } = $props();
	const sidebar = useSidebar();

	let activeServer = $state(servers[0]);
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
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
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>