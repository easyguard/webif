<script>
	import * as Alert from "$lib/components/ui/alert";
	import Button from "$lib/components/ui/button/button.svelte";
	import { MonitorDownIcon } from "lucide-svelte";
</script>

<Alert.Root>
	<MonitorDownIcon class="h-4 w-4" />
	<Alert.Title>Required module missing</Alert.Title>
	<Alert.Description class="flex flex-col">
		A VPN module is required for this.
		<Button class="mt-4 w-min">Browse modules</Button>
	</Alert.Description>
</Alert.Root>