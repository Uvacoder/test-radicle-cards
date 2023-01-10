<script lang="ts">
  import type { Wallet } from "@app/lib/wallet";

  import { get } from "svelte/store";

  import * as modal from "@app/lib/modal";
  import Button from "@app/components/Button.svelte";
  import ConnectWalletModal from "@app/components/Connect/ConnectWalletModal.svelte";
  import ErrorModal from "@app/components/ErrorModal.svelte";

  import { Connection, state } from "@app/lib/session";

  export let caption = "Connect";
  export let wallet: Wallet;
  export let buttonVariant: "foreground" | "primary";

  const onModalClose = () => {
    const wcs = get(wallet.walletConnect.state);

    if (wcs.state === "open") {
      wallet.walletConnect.state.set({ state: "close" });
      wcs.onClose();
    }
  };

  const onConnect = async () => {
    try {
      await state.connectWalletConnect(wallet);
    } catch (error: unknown) {
      modal.show(ErrorModal, {
        emoji: "👛",
        title: "Connection failed",
        error,
      });
    }
  };

  $: connecting = $state.connection === Connection.Connecting;
  $: walletConnectState = wallet.walletConnect.state;
</script>

<Button
  on:click={onConnect}
  variant={buttonVariant}
  disabled={connecting}
  waiting={connecting}>
  {#if connecting}
    Connecting…
  {:else}
    {caption}
  {/if}
</Button>

{#if $walletConnectState.state === "open"}
  <ConnectWalletModal
    {wallet}
    uri={$walletConnectState.uri}
    on:close={onModalClose} />
{/if}
