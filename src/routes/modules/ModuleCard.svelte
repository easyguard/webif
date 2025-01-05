<script lang="ts">
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";

	let {
		name,
		description,
		content,
		installed,
		tags,
		proprietary = false
	}: {
		name: string;
		description: string;
		content: string;
		installed: boolean;
		tags: string[];
		proprietary?: boolean;
	} = $props();
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

		<Button disabled={installed}>Install</Button>
	</Card.Footer>
</Card.Root>