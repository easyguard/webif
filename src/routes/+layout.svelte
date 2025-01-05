<script lang="ts">
	import { openChanges, token, commit } from '$lib/api.svelte';
	import AppSidebar from '$lib/components/AppSidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { fade, slide } from 'svelte/transition';
	import '../app.css';
	import Login from './Login.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';

	let { children } = $props();

	function commitChanges() {
		toast.promise(commit, {
			loading: "Committing changes...",
			success: "Changes committed!",
			error: "Failed to commit changes."
		})
	}
</script>

<svelte:head>
	<title>EasyGuard</title>
</svelte:head>

<Toaster />

{#if token.token}
	<Sidebar.Provider>
		<AppSidebar />
		<Sidebar.Inset>
			<header class="flex h-16 shrink-0 items-center gap-2">
				<div class="flex items-center gap-2 px-4">
					<Sidebar.Trigger class="-ml-1" />
					<Separator orientation="vertical" class="mr-2 h-4" />
					<span>EasyGuard Firewall</span>
				</div>
				<div class="ml-auto mr-5">
					<Button variant={
						openChanges.changes == 0
							? "secondary"
							: "default"
					} onclick={() => {commitChanges()}}>Commit</Button>
				</div>
			</header>
			<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
				<main>
					{@render children()}
				</main>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{:else}
	<Login />
{/if}
