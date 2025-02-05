<script>
	import { createTemplate, deleteTemplate, getTemplates } from "$lib/api.svelte";
	import { Button } from "$lib/components/ui/button";
	import * as Card from "$lib/components/ui/card";
	import { getRules, loadRules } from "$lib/TemplateManager.svelte";
	import { PlusIcon, Trash2Icon } from "lucide-svelte";
	import RuleCard from "./RuleCard.svelte";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import * as Dialog from "$lib/components/ui/dialog";
	import Input from "$lib/components/ui/input/input.svelte";

	let selectedTemplate = $state("");

	let deleting = $state("");

	let createDialog = $state(false);

	let newTemplateName = $state("");
</script>

<AlertDialog.Root open={deleting !== ""}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete this template.
				Make sure this template is not used in any zones before deleting.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel onclick={() => {
				deleting = "";
			}}>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action onclick={async () => {
				await deleteTemplate(deleting);
				deleting = "";
			}}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={createDialog}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>New Template</Dialog.Title>
      <Dialog.Description>
				This will create a new template to be used in the firewall rules.
      </Dialog.Description>
    </Dialog.Header>
		<Input placeholder="Template Name" bind:value={newTemplateName} />
		<Dialog.Footer>
			<Button type="submit" onclick={async () => {
				await createTemplate(newTemplateName);
				createDialog = false;
			}}>Create</Button>
		</Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

{#key deleting + createDialog}
	{#await getTemplates()}
		<span>Loading...</span>
	{:then templates}
		{#if selectedTemplate != ""}
			<div class="mb-2">
				<RuleCard template={selectedTemplate} rules={getRules()} close={() => {
					selectedTemplate = "";
				}} />
			</div>
		{/if}
		{#if templates.length == 0}
			<span>No templates found.</span>
		{/if}
		<div class="flex flex-wrap gap-2">
			{#each templates as template}
				<Card.Root>
					<Card.Header>
						<Card.Title>{template.replace(".json", "")}</Card.Title>
					</Card.Header>
					<Card.Footer class="mt-2 flex gap-2">
						<Button onclick={async () => {
							await loadRules(template.replace(".json", ""));
							selectedTemplate = template.replace(".json", "");
						}}>Open</Button>
						<Button variant="destructive" onclick={() => {
							deleting = template.replace(".json", "");
						}}>
							<Trash2Icon />
						</Button>
					</Card.Footer>
				</Card.Root>
			{/each}
			<Card.Root>
				<Card.Content>
					<button class="flex items-center justify-center" onclick={() => {
						createDialog = true;
					}}>
						<PlusIcon size={80} />
					</button>
				</Card.Content>
			</Card.Root>
		</div>
	{:catch error}
		<span>Error: {error.message}</span>
	{/await}
{/key}