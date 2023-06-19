import { parseKeybinding, matchKeybinding } from './keys.js';

/** @type {Map<HTMLElement, import('./types.js').RovingState>} */
const state = new Map();

let shouldAddWindowListener = true;

const formElements = ['input', 'textarea', 'select', 'button'];

/**
 * Check if a node is a form element or is a child of a form element
 * @param {HTMLElement} node
 * @returns {boolean}
 * @private
 */
function checkIfFormElement(node) {
  return node.matches(formElements.join(', ')) || node.closest('[contenteditable="true"]');
}

/**
 * Handle keydown events for roving tabindex
 *
 * @param {KeyboardEvent} event
 */
function handleRoverKeydown(event) {
  const { currentTarget: rover } = event;

  // check if target is a form element
  if (checkIfFormElement(event.target)) return;

  switch (event.key) {
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      event.stopPropagation();
      move(rover, -1);
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      event.stopPropagation();
      move(rover, 1);
      break;
    default:
      break;
  }
}

/**
 * Watch for keydown events on the window
 *
 * @param {KeyboardEvent} event
 */
function handleWindowKeydown(event) {
  if (!state.get('scope')) return;

  const rx = state.get(state.get('scope'));
  if (!rx) return;

  const { target } = event;

  // check if target is a form element
  if (checkIfFormElement(target)) return;

  let handler;

  for (let [keybinding, _handler] of rx.keybindings) {
    if (matchKeybinding(event, keybinding)) {
      if (rx.preventDefault) event.preventDefault();
      handler = _handler;
      break;
    }
  }

  if (!handler) return;

  // check if target belongs to the roving group
  if (!rx.targets.some((item) => item.contains(target))) return;

  event.preventDefault();
  event.stopPropagation();
  const item = rx.targets.find((item) => item.contains(target));
  const index = rx.targets.indexOf(item);

  handler?.(item, index);
}

/**
 * Activate an item in a roving tabindex
 *
 * @param {HTMLElement} rover
 * @param {HTMLElement} item
 */
function activate(rover, item) {
  const rx = state.get(rover);

  rx.active.tabIndex = -1;

  rx.active = item;
  rx.active.tabIndex = 0;
  rx.active.focus();

  const previous = rx.index - 1 < 0 ? rx.targets.length - 1 : rx.index - 1;
  const next = rx.index + 1 > rx.targets.length - 1 ? 0 : rx.index + 1;

  rx.callback && rx.callback(item, rx.index, previous, next);
}

/**
 * Handle focusin events for roving tabindex
 *
 * @param {FocusEvent} event
 * @returns
 */
function handleFocusIn(event) {
  const { currentTarget: rover } = event;

  state.set('scope', rover);

  if (state.get('last_rover') === rover) return;

  if (state.has(rover)) {
    state.set('last_rover', rover);

    activate(rover, state.get(rover).active);
  }
}

/**
 * Handle focusout events for roving tabindex
 *
 * @param {FocusEvent} event
 * @returns
 */
function handleFocusout(event) {
  const { relatedTarget } = event;

  const rover = state.get('scope');

  if (!rover || rover.contains(relatedTarget)) return;

  state.delete('scope');
}

/**
 * Move the roving tabindex in a direction
 *
 * @param {HTMLElement} rover - the group of elements to rove
 * @param {1 | -1} direction - 1 or -1
 * @returns
 */
function move(rover, direction) {
  const rx = state.get(rover);

  const nextIndex = rx.index + direction;

  rx.index = nextIndex < 0 ? rx.targets.length - 1 : nextIndex % rx.targets.length;

  activate(rover, rx.targets[rx.index]);
}

/**
 * Sets up a roving tab index for a given DOM node. The roving tab index allows keyboard
 * navigation between a group of related elements, such as a list of buttons or links.
 *
 * @function
 * @param {HTMLElement} node - The DOM node to set up the roving tab index for.
 * @param {import('./types.js').RovingOptions} [options={}] - An object containing options for the roving tab index.
 */
export default function roving(node, options = {}) {
  const { target = '', startIndex = 0, callback, keybindings = {} } = options;

  const selectedTarget = target || ':scope > *';

  const targets = Array.from(node.querySelectorAll(selectedTarget));
  const active = targets[startIndex];

  node.tabIndex = -1;

  targets.forEach((item, index) => {
    item.tabIndex = index === startIndex ? 0 : -1;
  });

  node.addEventListener('keydown', handleRoverKeydown);
  node.addEventListener('focusin', handleFocusIn);
  node.addEventListener('focusout', handleFocusout);

  if (shouldAddWindowListener && Object.keys(keybindings).length > 0) {
    window.addEventListener('keydown', handleWindowKeydown, true);
    shouldAddWindowListener = false;
  }

  state.set(node, {
    targets,
    active,
    callback,
    index: startIndex,
    keybindings: Object.keys(keybindings).reduce((acc, key) => {
      acc.set(parseKeybinding(key), keybindings[key]);
      return acc;
    }, new Map())
  });

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const { addedNodes } = mutation;

      addedNodes.forEach((node) => {
        if (node.matches?.(selectedTarget)) node.tabIndex = -1;
      });

      const rx = state.get(node);

      rx.targets = Array.from(node.querySelectorAll(selectedTarget));
    });
  });

  observer.observe(node, {
    childList: true,
    subtree: true
  });

  return {
    destroy() {
      node.removeEventListener('focusin', handleFocusIn);
      node.removeEventListener('keydown', handleRoverKeydown);
      observer.disconnect();
      state.delete(node);

      if (state.size === 0) {
        window.removeEventListener('keydown', handleWindowKeydown, true);
        shouldAddWindowListener = true;
      }
    }
  };
}
