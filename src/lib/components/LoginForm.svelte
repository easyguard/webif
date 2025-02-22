<script lang="ts">
	import { catchHandler, token } from "$lib/api.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import LoaderCircle from "lucide-svelte/icons/loader-circle";
	import { useSidebar } from "./ui/sidebar";
	import { API_ROOT } from "$lib/routers.svelte";

	let loggingIn = false;
	let username = "root";
	let password = "";

	async function login() {
		loggingIn = true;
		const newtoken = btoa(`${username}:${password}`);
		const res = await fetch(API_ROOT + "ping", {
			headers: {
				"Authorization": `Basic ${newtoken}`
			}
		}).catch(catchHandler);
		if(!res || !res.ok) {
			loggingIn = false;
			password = "";
			return;
		}
		token.token = "Basic " + newtoken;
		loggingIn = false;
	}
</script>

<Card.Root class="mx-auto max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your credentials below to login to your firewall.</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="username">Username</Label>
				<Input id="username" required disabled={loggingIn} bind:value={username} />
			</div>
			<div class="grid gap-2">
				<div class="flex items-center">
					<Label for="password">Password</Label>
				</div>
				<Input id="password" type="password" required disabled={loggingIn} bind:value={password} onkeypress={(e) => {
					if(e.key === "Enter") {
						login();
					}
				}} />
			</div>
			<Button type="submit" class="w-full" onclick={login} loading={loggingIn}>
				Login
			</Button>
		</div>
	</Card.Content>
</Card.Root>