<script lang="ts">
	import { fetchDNS, getDNS, patchDNS } from "$lib/api.svelte";
    import InspectorContextMenu from "$lib/components/InspectorContextMenu.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Input } from "$lib/components/ui/input";
	import { Skeleton } from "$lib/components/ui/skeleton";

	$effect(() => {
		fetchDNS();
	})

	let changed = $state(false);

	$inspect(changed);
</script>

{#if getDNS() == null}
	<Skeleton class="w-full h-96" />
{:else}
	{@const dns = getDNS()}
	<InspectorContextMenu data={dns} title="Raw DNS" defaultFormat="yaml">
		<div class="flex gap-2 flex-col">
			{#if changed}
			<Card.Root>
				<Card.Header>
					<Card.Title>Änderungen</Card.Title>
					<Card.Description>Es wurden Änderungen vorgenommen, die noch nicht gespeichert wurden.</Card.Description>
				</Card.Header>
				<Card.Content>
					<Button variant="secondary" onclick={() => {
						fetchDNS();
						changed = false;
					}}>Verwerfen</Button>
					<Button onclick={() => {
						patchDNS();
						changed = false;
					}}>Speichern</Button>
				</Card.Content>
			</Card.Root>
			{/if}
			<Card.Root>
				<Card.Header>
					<Card.Title>Upstream</Card.Title>
					<Card.Description>Die DNS-Server, die von deinem Router verwendet werden.</Card.Description>
				</Card.Header>
				<Card.Content>
					{#each dns.upstream.default as server, index}
						<Input value={server} onchange={(e) => {
							if(!e.currentTarget.value) return;
							dns.upstream.default[index] = e.currentTarget.value;
							changed = true;
						}} />
					{/each}
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Sperrlisten</Card.Title>
					<Card.Description>Liste von Adressen, welche gesperrt werden.</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="flex flex-col gap-2">
						{#each Object.keys(dns.blocking.blackLists) as category}
							<div>
								<h2 class="text-xl">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
								{#each dns.blocking.blackLists[category] as blacklist}
									<p class="text-muted-foreground">
										{#each blacklist.split('/') as part, index}
											{#if index === 2 || index === blacklist.split('/').length - 1}
												<span style="color: #fff;">{part}</span>{#if index !== blacklist.split('/').length - 1}/{/if}
											{:else}
												{part}/
											{/if}
										{/each}
									</p>
								{/each}
							</div>
						{/each}
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Eigene Adressen</Card.Title>
					<Card.Description>Adressen, die von deinem Router aufgelöst werden.</Card.Description>
				</Card.Header>
				<Card.Content>
					{#each Object.keys(dns.customDNS.mapping) as custom}
						<p>{custom} → {dns.customDNS.mapping[custom]}</p>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</InspectorContextMenu>
{/if}