<script lang="ts">
  import { twemoji } from "@app/lib/utils";
  import Modal from "@app/components/Modal.svelte";
</script>

<style>
  .hotkeys {
    display: grid;
    grid-template-columns: 4rem 13rem;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }

  .key {
    border: 1px solid var(--color-secondary-4);
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .description {
    text-align: left;
  }
</style>

<Modal center>
  <svelte:fragment slot="title">
    <div use:twemoji>⌨️</div>
    <div>Keyboard shortcuts</div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <div class="hotkeys">
      <div class="key txt-bold">?</div>
      <div class="description">Keyboard shortcuts</div>

      {#if import.meta.env.DEV}
        <div class="key txt-bold">d</div>
        <div class="description">Color palette</div>
      {/if}

      <div class="key txt-bold">/</div>
      <div class="description">Search</div>

      <div class="key txt-bold">tab</div>
      <div class="description">Navigate elements</div>

      <div class="key txt-bold">enter</div>
      <div class="description">Submit</div>

      <div class="key txt-bold">esc</div>
      <div class="description">Close modal, defocus field</div>
    </div>
  </svelte:fragment>
</Modal>
