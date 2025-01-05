<script>
	import LoginForm from "$lib/components/LoginForm.svelte";
	import ServerSwitcher from "$lib/components/ServerSwitcher.svelte";
	import SimpleServerSwitcher from "$lib/components/SimpleServerSwitcher.svelte";
	import { getServers } from "$lib/routers.svelte";
</script>

<div class="flex h-screen w-full items-center justify-center px-4 flex-col gap-5">
	<div class="flex gap-2 items-center">
		<svg width="50px" height="50px" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 5.75A.75.75 0 0 1 3.75 5c2.663 0 5.258-.943 7.8-2.85a.75.75 0 0 1 .9 0C14.992 4.057 17.587 5 20.25 5a.75.75 0 0 1 .75.75V11c0 5.001-2.958 8.676-8.725 10.948a.75.75 0 0 1-.55 0C5.958 19.676 3 16 3 11V5.75Z" fill="#ffffff"/></svg>
		<h2 class="font-bold text-2xl" style="font-family: 'Quicksand Variable';">EasyGuard</h2>
	</div>
	<LoginForm />
	<div class="w-60">
		<SimpleServerSwitcher servers={getServers()} />
	</div>
</div>