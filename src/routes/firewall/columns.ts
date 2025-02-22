import { renderComponent } from "$lib/components/ui/data-table";
import type { ColumnDef } from "@tanstack/table-core";
import DataTableActions from "./data-table-actions.svelte";
import ports from "$lib/ports";
import Port from "$lib/components/Port.svelte";
import PortUsage from "$lib/components/PortUsage.svelte";

export function getColumns(fromZone: string, toZone: string): ColumnDef<FirewallRule>[] {
	return [
		{
			id: "use",
			header: "Usage",
			cell: ({ row }) => {
				// return ports[row.original.protocol][row.original.port || row.original.type] || "";
				return renderComponent(PortUsage, { port: row.original.port, type: row.original.type, protocol: row.original.protocol });
			}
		},
		{
			id: "port",
			header: "Port",
			cell: ({ row }) => {
				// return row.original.port + "/" + row.original.protocol.toUpperCase();
				return renderComponent(Port, { port: row.original.port, type: row.original.type, protocol: row.original.protocol });
			}
		},
		{
			id: "actions",
			cell: ({ row }) => {
				return renderComponent(DataTableActions, { id: (row.original.protocol == "icmp" ? row.original.type : row.original.port) + "/" + row.original.protocol, fromZone, toZone });
			}
		}
	];
}
