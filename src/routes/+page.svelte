<script>
	import { getIP, getLink, getRoute, ping, traceroute } from "$lib/api.svelte";
	import { BadgeAlertIcon, BadgeCheckIcon, BadgeHelpIcon, BadgeInfoIcon, ShieldEllipsisIcon } from "lucide-svelte";
</script>

{#await getIP()}
	<p>Fetching IPs...</p>
{:then ip}
	{#await getLink()}
		<p>Fetching Links...</p>
	{:then link}
		<h1 class="text-2xl">Interfaces:</h1>
		<ul>
			{#each (link.match(/^\d+: (\w+):/gm) || []) as match}
			{#if !match.includes("lo")}
				{@const ifname = match.replace(/^\d+: /, '').replace(/:.*/, '')}
				{@const up = link.split(match)[1].split(": ")[0].split("    ").find((x) => x.includes("UP"))}
				{@const alias = link.split(match)[1].split(": ")[0].split("    ").find((x) => x.includes("alias"))?.split("\"")[1] || "UNTRACKED"}
				{@const ipMatch = (ip.match(/^\d+: (\w+):/gm) || []).find((x) => x.includes(match))}
				{@const ipAddr = ipMatch ? ip.split(ipMatch)[1].split("    ").find((x) => x.includes("inet"))?.split(" ")[1] || "(none)" : "(none)"}
				<li class="flex gap-2">
					{#if up && ipAddr !== "(none)"}
						{#if alias === "CONFIGURED"}
						<BadgeCheckIcon class="stroke-green-500" />
						{:else}
							<ShieldEllipsisIcon class="stroke-blue-500" />
						{/if}
					{:else}
						{#if alias === "UNTRACKED"}
							<BadgeHelpIcon class="stroke-amber-500" />
						{:else}
							<BadgeAlertIcon class="stroke-red-500" />
						{/if}
					{/if}
					<div>
						<span>{ifname}</span>
						<span>is</span>
						{#if up}
							<span>UP</span>
						{:else}
							<span>DOWN</span>
						{/if}
						<span>and {alias}</span>
						<span>with IP {ipAddr}</span>
					</div>
				</li>
			{/if}
			{/each}
		</ul>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<hr class="mt-2">

{#await getRoute()}
	<p>Fetching Routes...</p>
{:then route}
	<h1 class="text-2xl mt-2">Connection:</h1>
	{@const gateway = route.split("default via ")[1].split(" ")[0]}

	<p class="flex items-center gap-2">
		<BadgeInfoIcon class="stroke-blue-500" />
		Gateway is {gateway}
	</p>
	{#await ping(gateway)}
		<p>Pinging Gateway...</p>
	{:then ping}
		{#if ping.includes("1 packets received")}
			<p class="flex items-center gap-2">
				<BadgeCheckIcon class="stroke-green-500" />
				Gateway is reachable
			</p>
		{:else}
			<p class="flex items-center gap-2">
				<BadgeAlertIcon class="stroke-red-500" />
				Gateway is unreachable
			</p>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

{#await ping("google.com")}
	<p>Pinging google.com...</p>
{:then ping}
	{#if ping.includes("1 packets received")}
		<p class="flex items-center gap-2">
			<BadgeCheckIcon class="stroke-green-500" />
			Internet is reachable
		</p>
	{:else}
		<p class="flex items-center gap-2">
			<BadgeAlertIcon class="stroke-red-500" />
			Internet is unreachable
		</p>
	{/if}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
