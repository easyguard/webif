<script lang="ts">
	let { port, type, protocol }: { port: number, type: string, protocol: string } = $props();
</script>

<span class="port">
	<span>{protocol == "icmp" ? type : port}</span>
	<span style="color: #acacac; font-size: .9em;">/</span>
	<span>{protocol.toUpperCase()}</span>
</span>

<style>
	.port {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
</style>