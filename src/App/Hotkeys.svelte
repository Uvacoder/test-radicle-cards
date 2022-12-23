<script lang="ts">
  import * as modal from "./GlobalModal.svelte";

  import ColorPalette from "./ColorPalette.svelte";
  import HelpModal from "./HelpModal.svelte";

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      modal.hide();
      return;
    }

    switch (event.key) {
      case "?":
        modal.toggle(HelpModal);
        break;
      case "/":
        event.preventDefault();
        (
          document.querySelector(
            '*[placeholder="Search a name or address…"]',
          ) as HTMLElement | null
        )?.focus();
        break;
      case "d":
        if (import.meta.env.PROD) {
          return;
        }
        modal.toggle(ColorPalette);
        break;
    }
  };
</script>

<svelte:window on:keydown={onKeydown} />
