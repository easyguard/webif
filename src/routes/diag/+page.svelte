<script lang="ts">
	import { getIP, getLink, getRoute, ping, traceroute } from "$lib/api.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";

	let host = $state("");
	let output: boolean | string = $state(false);
</script>

<h1>IP Addresses:</h1>
{#await getIP()}
	<p>Fetching IP Addresses...</p>
{:then ip}
	<pre>{ip}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<hr>

<h1>IP Links:</h1>
{#await getLink()}
	<p>Fetching Links...</p>
{:then link}
	<pre>{link}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<hr>

<h1>IP Route:</h1>
{#await getRoute()}
	<p>Fetching Route...</p>
{:then route}
	<pre>{route}</pre>

	{@const gateway = route.split("default via ")[1].split(" ")[0]}
	<p>Gateway: {gateway}</p>
	<hr>
	<h1>Gateway ping:</h1>
	{#await ping(gateway)}
		<p>Pinging Gateway...</p>
	{:then ping}
		<pre>{ping}</pre>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}

{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<hr>

<h1>Traceroute to google.com:</h1>
{#await traceroute("google.com")}
	<p>Tracerouting google.com...</p>
{:then trace}
	<pre>{trace}</pre>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}

<hr>

<h1>Ping/Traceroute</h1>
<div class="flex gap-2">
	<Input type="text" placeholder="Enter IP Address or Domain" bind:value={host} />
	<Button onclick={async () => {
		output = true;
		output = await ping(host)
	}}>Ping</Button>
	<Button onclick={async () => {
		output = true;
		output = await traceroute(host)
	}}>Traceroute</Button>
</div>
{#if output}
	{#if output === true}
		<p>Processing...</p>
	{:else}
		<pre>{output}</pre>
	{/if}
{/if}

<style>
	h1 {
		font-size: 1.4rem;
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
