<script lang="ts" context="module">
  import { derived, get, writable } from "svelte/store";
  import type { SvelteComponent } from "svelte";

  type HideCallback = () => void;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function callbackPlaceholder(): void {}

  type Props = { [propName: string]: unknown };
  type Modal = {
    component: typeof SvelteComponent;
    props: Props;
    hideCallback: HideCallback;
  };

  const store = writable<Modal | undefined>(undefined);
  export const modalStore = derived(store, $store => $store);

  export const hide = (): void => {
    const stored = get(modalStore);
    if (!stored) {
      return;
    }

    stored.hideCallback();
    store.set(undefined);
  };

  export const show = (
    component: typeof SvelteComponent,
    props: Props = {},
    hideCallback: HideCallback = callbackPlaceholder,
  ): void => {
    store.set({ component, hideCallback, props });
  };

  export const toggle = (
    component: typeof SvelteComponent,
    props: Props = {},
    hideCallback: HideCallback = callbackPlaceholder,
  ): void => {
    const stored = get(modalStore);

    if (stored && stored.component === component) {
      hide();
      return;
    }

    show(component, props, hideCallback);
  };
</script>

<style>
  .full-screen {
    height: 100vh;
    width: 100vw;
    position: fixed;
    z-index: 100;
    align-items: center;
    justify-content: center;
    overflow: scroll;
  }

  .overlay {
    background-color: black;
    opacity: 0.7;
    height: 100%;
    width: 100%;
    position: fixed;
  }

  .content {
    z-index: 200;
    margin: auto;
  }
</style>

<div class="full-screen" style:display={!$modalStore ? "none" : "flex"}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="overlay" on:click={hide} />
  <div class="content">
    {#if $modalStore}
      <svelte:component this={$modalStore.component} {...$modalStore.props} />
    {/if}
  </div>
</div>
