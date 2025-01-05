<script>
	import ModuleCard from "./ModuleCard.svelte";
</script>

<div class="flex flex-wrap gap-2">
	<ModuleCard name="WireGuard" description="Extremely simple yet fast and modern VPN" content="Allows WireGuard Tunnels" tags={["VPN"]} installed={false} />
	<ModuleCard name="Tailscale" description="Software-defined mesh VPN and a web-based management service" content="Allows Tailscale/Headscale Tunnels" tags={["VPN"]} installed={true} proprietary={true} />
	<ModuleCard name="PixieCore" description="Tool to manage network booting of machines" content="Allows Netbooting" tags={["PXE"]} installed={false} />
	<ModuleCard name="S1 Panel" description="EasyGuard Display for S1 Panel" content="Enables S1 display" tags={["Display"]} installed={false} />
</div>
