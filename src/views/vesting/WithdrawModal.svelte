<script lang="ts" strictEvents>
  import type { VestingInfo } from "@app/lib/vesting";
  import type { Wallet } from "@app/lib/wallet";

  import * as utils from "@app/lib/utils";

  import * as modal from "@app/lib/modal";
  import Button from "@app/components/Button.svelte";
  import Loading from "@app/components/Loading.svelte";
  import Modal from "@app/components/Modal.svelte";
  import { onMount } from "svelte";
  import { state } from "@app/lib/vesting";
  import { withdrawVested } from "@app/lib/vesting";

  export let contractAddress: string;
  export let info: VestingInfo;
  export let wallet: Wallet;

  onMount(async () => {
    await withdrawVested(contractAddress, wallet);
  });
</script>

<style>
  .actions {
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }
</style>

<Modal>
  <span slot="title">
    {utils.formatAddress(contractAddress)}
  </span>

  <span slot="subtitle">
    {#if $state.type === "withdrawingSign"}
      <span class="txt-missing">Waiting for a signature…</span>
    {:else if $state.type === "withdrawing"}
      <span class="txt-missing">Waiting for confirmation…</span>
    {/if}
  </span>

  <span slot="body">
    {#if $state.type === "withdrawn"}
      <span>
        Tokens have been withdrawn to <span class="txt-highlight">
          {utils.formatAddress(info.beneficiary)}
        </span>
      </span>
    {:else}
      <Loading small center />
    {/if}
  </span>

  <span class="actions" slot="actions">
    <Button variant="foreground" on:click={modal.hide}>Close</Button>
  </span>
</Modal>
