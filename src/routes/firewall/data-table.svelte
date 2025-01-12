<script lang="ts" generics="TData, TValue">
	import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
	import {
		createSvelteTable,
		FlexRender,
	} from "$lib/components/ui/data-table/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button";
	import Input from "$lib/components/ui/input/input.svelte";
	import * as Select from "$lib/components/ui/select";
	import { addRule } from "$lib/api.svelte";
 
	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
	};
 
	let { data, columns, fromZone, toZone }: DataTableProps<TData, TValue> & { fromZone: string, toZone: string } = $props();
 
	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	let newRule: FirewallRule = $state({
		port: 80,
		protocol: "tcp",
		type: "",
		limit: "",
		ip: null
	});

	let icmpTypes = [
		"echo-request", "echo-reply", "destination-unreachable", "source-quench", "redirect", "time-exceeded", "parameter-problem", "timestamp-request", "timestamp-reply", "info-request", "info-reply", "address-mask-request", "address-mask-reply", "router-advertisement", "router-solicitation"
	]
</script>

<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && "selected"}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender
								content={cell.column.columnDef.cell}
								context={cell.getContext()}
							/>
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">
						No results.
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Footer>
			<Table.Row>
				<Table.Cell></Table.Cell>
				<Table.Cell>
					<div class="flex items-center gap-2">
						{#if newRule.protocol == "icmp"}
							<Select.Root type="single" bind:value={newRule.type}>
								<Select.Trigger>{newRule.type || "Type"}</Select.Trigger>
								<Select.Content>
									{#each icmpTypes as type}
										<Select.Item value={type}>{type}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{:else}
							<Input placeholder="Port" type="number" bind:value={newRule.port} />
						{/if}
						<span>/</span>
						<Select.Root type="single" bind:value={newRule.protocol}>
							<Select.Trigger>{newRule.protocol.toUpperCase() || "Protocol"}</Select.Trigger>
							<Select.Content>
								<Select.Item value="tcp">TCP</Select.Item>
								<Select.Item value="udp">UDP</Select.Item>
								<Select.Item value="icmp">ICMP</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</Table.Cell>
				<Table.Cell>
					<Button onclick={async () => {
						console.log(newRule);
						await addRule(fromZone, toZone, newRule);
					}}>Add</Button>
				</Table.Cell>
			</Table.Row>
		</Table.Footer>
	</Table.Root>
</div>
