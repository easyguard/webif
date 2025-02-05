<script>
	import House from "lucide-svelte/icons/house";
	import * as Sidebar from "./ui/sidebar";
	import BrickWall from "lucide-svelte/icons/brick-wall";
	import Ban from "lucide-svelte/icons/ban";
	import EarthLock from "lucide-svelte/icons/earth-lock";
	import Globe from "lucide-svelte/icons/globe";
	import LaptopMinimal from "lucide-svelte/icons/laptop-minimal";
	import MonitorPlay from "lucide-svelte/icons/monitor-play";
	import * as DropdownMenu from "./ui/dropdown-menu";
	import { ChevronsUpDown, PackageIcon, Shield, Stethoscope } from "lucide-svelte";
	import ServerSwitcher from "./ServerSwitcher.svelte";
	import { page } from "$app/stores";
	import { getServers } from "$lib/routers.svelte";

	const items = [
		{
			title: "System",
			items: [
				{
					title: "Home",
					url: "/",
					icon: House,
				},
				{
					title: "Modules/Packages",
					url: "/modules",
					icon: PackageIcon
				},
			]
		},
		{
			title: "Network",
			items: [
				{
					title: "Networks",
					url: "/network",
					icon: Globe,
				},
				{
					title: "Firewall",
					url: "/firewall",
					icon: BrickWall,
				},
				{
					title: "Blocks & DNS",
					url: "/dns",
					icon: Ban,
				},
				{
					title: "Tunnel",
					url: "/tunnel",
					icon: EarthLock,
					disabled: true
				},
			]
		},
		{
			title: "Extra",
			items: [
				{
					title: "PXE (Netboot)",
					url: "/netboot",
					icon: MonitorPlay,
					disabled: true
				},
				{
					title: "Diagnostic",
					url: "/diag",
					icon: Stethoscope
				}
			]
		}
  ];

	function getCurrentPage() {
		const group = items.find((item) => item.items.find((subitem) => subitem.url === $page.url.pathname));
		if(!group) return null;
		return group.items.find((subitem) => subitem.url === $page.url.pathname);
	}
</script>

<Sidebar.Root variant="drawer" collapsible="icon">
	<Sidebar.Header>
		<ServerSwitcher servers={getServers()} />
	</Sidebar.Header>
  <Sidebar.Content>
		{#each items as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={getCurrentPage() == item}>
									{#snippet child({ props })}
										<a href={item.disabled ? "#" : item.url} {...props}>
											<item.icon color={item.disabled ? "#acacac" : "#fff"} />
											<span style={item.disabled ? "color: #acacac;" : ""}>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
  </Sidebar.Content>
</Sidebar.Root>