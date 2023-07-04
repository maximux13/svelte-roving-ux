export type KeybindingCallback = (item: Node, index: number) => void;

export type SelectCallback = (item: Node, index: number, previous: number, next: number) => void;

export type Keybindings = {
  [key: string]: KeybindingCallback;
};

export type Keybinding = {
  key: string;
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  mod?: boolean;
  shift?: boolean;
};

export type RovingOptions = {
  /**
   * A CSS selector for the elements that should be included in the roving tab index.
   *
   * @default ':scope > *'
   */
  target?: string;
  /**
   * The index of the element that should be focused when the roving tab index is initialized.
   * If not provided, the first element will be focused.
   * @default 0
   */
  startIndex?: number;
  /**
   * A callback that will be called when an element is selected.
   * @param item The selected element.
   * @param index The index of the selected element.
   * @param previous The index of the previously selected element.
   * @param next The index of the next element that will be selected.
   * @default undefined
   *
   * @example
   * ```js
   * const callback = (item, index, previous, next) => {
   *  console.log(item, index, previous, next);
   * }
   * ```
   *
   * @example
   * ```js
   * const callback = (item, index, previous, next) => {
   *  item.classList.add('selected');
   * }
   * ```
   */
  callback?: SelectCallback;
  /**
   * A map of keybindings that will be applied to the current roving tab index.
   *
   * @default undefined
   *
   * @example
   * ```js
   * const keybindings = {
   *  space: (item, index) => {
   *    item.click();
   *  },
   * ```
   * @example
   * ```js
   * const keybindings = {
   *  'ctrl+space': (item, index) => {
   *    item.click();
   *  },
   *  'shift+space': (item, index) => {
   *    item.click();
   *  }
   * }
   * ```
   */
  keybindings?: Keybindings;
  /**
   * Prevents the default scroll behavior when the roving tab index is initialized.
   */
  preventScroll?: boolean;
};

export type RovingState = {
  targets: HTMLElement[];
  active: HTMLElement;
  index: number;
  previous: number;
  next: number;
  callback?: SelectCallback;
  keybindings?: Map<Keybinding, KeybindingCallback>;
  preventScroll?: boolean;
};
