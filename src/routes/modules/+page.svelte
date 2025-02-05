<script lang="ts">
	import { onMount } from "svelte";
	import ModuleCard from "./ModuleCard.svelte";
	import { apk } from "$lib/api.svelte";

	onMount(async () => {
		// console.log(await apk("info limes"));
	})
</script>

<div class="flex flex-wrap gap-2">
	<ModuleCard name="WireGuard" description="Extremely simple yet fast and modern VPN" content="Allows WireGuard Tunnels" tags={["VPN"]} pkg="wireguard-tools-wg-quick" additional={["wireguard-tools-openrc"]} />
	<ModuleCard name="Tailscale" description="Software-defined mesh VPN and a web-based management service" content="Allows Tailscale/Headscale Tunnels" tags={["VPN"]} pkg="tailscale" proprietary={true} />
	<ModuleCard name="PixieCore" description="Tool to manage network booting of machines" content="Allows Netbooting" tags={["PXE"]} pkg="pixiecore" />
	<ModuleCard name="S1 Panel" description="EasyGuard Display for S1 Panel" content="Enables S1 display" tags={["Display"]} pkg="ezgdisp" />
</div>
