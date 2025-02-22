<script lang="ts">
	import ports from "$lib/ports";
    import Badge from "./ui/badge/badge.svelte";
	import * as HoverCard from "./ui/hover-card";

	let { port, type, protocol }: { port: number, type: string, protocol: string } = $props();

	let portusage = ports[protocol][protocol === "icmp" ? type : port];
</script>

{#if portusage}
	<HoverCard.Root>
		<HoverCard.Trigger class="cursor-help">{portusage.name}</HoverCard.Trigger>
		<HoverCard.Content class="flex flex-col gap-2">
			<span>
				{portusage.fullname} - {portusage.description}
			</span>

			{#if portusage.tags}
				<div class="flex flex-wrap gap-2">
					{#each portusage.tags as tag}
						<Badge>{tag}</Badge>
					{/each}
				</div>
			{/if}

			{#if portusage.alternatives}
				<div>
					<strong>Alternatives:</strong>
					{#each portusage.alternatives as alternative}
						<div>{alternative}</div>
					{/each}
				</div>
			{/if}

			{#if portusage.important}
				<strong>Important for operation, only remove if you know what you are doing!</strong>
			{/if}

			{#if protocol != "icmp"}
				<a href="https://www.speedguide.net/port.php?port={port}" target="_blank" class="text-primary">More</a>
			{/if}
		</HoverCard.Content>
	</HoverCard.Root>
{/if}