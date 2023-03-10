<script lang="ts" context="module">
  export type State = "proposed" | "draft" | "archived";
</script>

<script lang="ts">
  import type { Wallet } from "@app/lib/wallet";
  import type { Patch } from "@app/lib/patch";
  import type { ToggleButtonOption } from "@app/components/ToggleButton.svelte";

  import PatchTeaser from "./Patch/PatchTeaser.svelte";
  import Placeholder from "@app/components/Placeholder.svelte";
  import ToggleButton from "@app/components/ToggleButton.svelte";

  import { capitalize } from "@app/lib/utils";
  import { groupPatches } from "@app/lib/patch";
  import * as router from "@app/lib/router";

  export let state: State;
  export let wallet: Wallet;
  export let patches: Patch[];

  let options: ToggleButtonOption<State>[];
  const sortedPatches = groupPatches(patches);

  $: filteredPatches = sortedPatches[state];
  $: options = [
    {
      value: "proposed",
      count: sortedPatches.proposed.length,
    },
    {
      value: "draft",
      count: sortedPatches.draft.length,
    },
    {
      value: "archived",
      count: sortedPatches.archived.length,
    },
  ];
</script>

<style>
  .patches {
    padding: 0 2rem 0 8rem;
    font-size: var(--font-size-small);
  }
  .patches-list {
    border-radius: var(--border-radius-small);
    overflow: hidden;
  }
  .teaser:not(:last-child) {
    border-bottom: 1px dashed var(--color-background);
  }

  @media (max-width: 960px) {
    .patches {
      padding-left: 2rem;
    }
  }
</style>

<div class="patches">
  <div style="margin-bottom: 1rem;">
    <ToggleButton
      {options}
      on:select={e =>
        router.updateProjectRoute({
          search: `state=${e.detail}`,
        })}
      active={state} />
  </div>

  {#if filteredPatches.length}
    <div class="patches-list">
      {#each filteredPatches as patch}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="teaser"
          on:click={() => {
            router.updateProjectRoute({
              view: { resource: "patch", params: { patch: patch.id } },
            });
          }}>
          <PatchTeaser {wallet} {patch} />
        </div>
      {/each}
    </div>
  {:else}
    <Placeholder emoji="????">
      <div slot="title">{capitalize(state)} patches</div>
      <div slot="body">No patches matched the current filter</div>
    </Placeholder>
  {/if}
</div>
