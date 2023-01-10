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
