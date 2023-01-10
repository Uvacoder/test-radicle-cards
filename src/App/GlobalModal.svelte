<script lang="ts">
  import { modalStore, hide } from "@app/lib/modal";
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
