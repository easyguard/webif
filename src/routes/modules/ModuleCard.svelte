<script lang="ts">
	import { apk, getWorld } from "$lib/api.svelte";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";

	let {
		name,
		description,
		content,
		pkg,
		tags,
		proprietary = false,
		additional = []
	}: {
		name: string;
		description: string;
		content: string;
		pkg: string;
		tags: string[];
		proprietary?: boolean;
		additional?: string[];
	} = $props();

	async function isInstalled(name: string) {
		const world = await getWorld();
		return world.includes(name + "\n");
	}

	let installed = $state(false);

	onMount(async () => {
		installed = await isInstalled(pkg);
	});
</script>

<Card.Root class="flex flex-col">
	<Card.Header>
		<Card.Title>{name}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<p>{content}</p>
		{#if proprietary}
			<p>This module includes proprietary components.</p>
		{/if}
	</Card.Content>
	<Card.Footer class="mt-auto flex-col items-start gap-2">
		{#if tags.length > 0}
			<div class="flex gap-2 mt-4">
				{#each tags as tag}
					<Badge variant="secondary">{tag}</Badge>
				{/each}
			</div>
		{/if}

		<Button disabled={installed} onclick={async () => {
			async function install() {
				const data = await apk("add " + pkg + " " + additional.join(" "));
				installed = true;
				console.log(data);
			}
			toast.promise(install, {
				loading: "Installing " + name + "...",
				success: "Successfully installed " + name + ".",
				error: "Failed to install " + name + "."
			})
		}}>Install</Button>
	</Card.Footer>
</Card.Root>