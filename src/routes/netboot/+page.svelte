<script>
	import * as Alert from "$lib/components/ui/alert";
	import Button from "$lib/components/ui/button/button.svelte";
	import { MonitorDownIcon } from "lucide-svelte";
</script>

<Alert.Root>
	<MonitorDownIcon class="h-4 w-4" />
	<Alert.Title>Required module missing</Alert.Title>
	<Alert.Description class="flex flex-col">
		The "pixiecore" module is required for this.
		<Button class="mt-4 w-min">Install module</Button>
	</Alert.Description>
</Alert.Root>