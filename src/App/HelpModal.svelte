<script lang="ts">
  import { twemoji } from "@app/lib/utils";
  import Modal from "@app/components/Modal.svelte";
</script>

<style>
  .hotkeys {
    gap: 3rem;
    align-items: flex-start;
    justify-content: center;
    display: flex;
    color: var(--color-foreground-6);
  }

  .key {
    border: 1px solid var(--color-secondary-5);
    box-shadow: inset 0 -4px 0 var(--color-secondary-5);
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-small);
    background-color: var(--color-secondary-1);
    min-width: 2rem;
    padding: 0 1rem 4px 1rem;
  }

  .description {
    text-align: left;
  }

  .pair {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .group {
    display: flex;
    gap: 2rem;
    flex-direction: column;
  }
</style>

<Modal center>
  <svelte:fragment slot="title">
    <div use:twemoji>⌨️</div>
    <div>Keyboard shortcuts</div>
  </svelte:fragment>

  <svelte:fragment slot="body">
    <div class="hotkeys">
      <div class="group">
        <div class="pair">
          <div class="key txt-bold">?</div>
          <div class="description">Shortcuts</div>
        </div>

        <div class="pair">
          <div class="key txt-bold">/</div>
          <div class="description">Search</div>
        </div>

        <div class="pair">
          <div class="key txt-bold">tab</div>
          <div class="description">Navigate</div>
        </div>
      </div>

      <div class="group">
        <div class="pair">
          <div class="key txt-bold">enter</div>
          <div class="description">Submit</div>
        </div>

        <div class="pair">
          <div class="key txt-bold">esc</div>
          <div class="description">Close</div>
        </div>

        {#if import.meta.env.DEV}
          <div class="pair">
            <div class="key txt-bold">d</div>
            <div class="description">Color palette</div>
          </div>
        {/if}
      </div>
    </div>
  </svelte:fragment>
</Modal>
