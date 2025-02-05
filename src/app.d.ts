// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type FirewallChain = {
		ports: FirewallRule[],
		include: string[] | null,
	}

	type FirewallRule = {
		protocol: string,
		type: string,
		port: number
		limit: string?,
		ip: string?
	}
}

export {};
