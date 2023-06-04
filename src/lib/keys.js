/**
 * @param {string} key
 * @returns string | number
 */
function transModifierKey(key) {
  switch (key) {
    case 'ctrl':
      return 'Control';
    case 'shift':
      return 'Shift';
    case 'alt':
      return 'Alt';
    case 'cmd':
    case 'meta':
    case 'mod':
      return 'Meta';
    case 'enter':
      return 'Enter';
    case 'space':
      return ' ';
    case 'escape':
    case 'esc':
      return 'Escape';
    case 'left':
      return 'ArrowLeft';
    case 'right':
      return 'ArrowRight';
    case 'up':
      return 'ArrowUp';
    case 'bottom':
      return 'ArrowBottom';
    case 'delete':
      return 'Backspace';
    default:
      return key;
  }
}

/**
 * @param {string} keybinding - the keybinding to parse
 * @returns {import('./types.js').Keybinding} - the parsed keybinding
 */
export function parseKeybinding(keybinding) {
  const keys = keybinding
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .map(transModifierKey);

  return {
    key: keys.pop(),
    alt: keys.includes('Alt'),
    ctrl: keys.includes('Control'),
    meta: keys.includes('Meta'),
    shift: keys.includes('Shift')
  };
}

/**
 * Check if a keybinding matches a keyboard event
 *
 * @param {KeyboardEvent} event
 * @param {import('./types.js').Keybinding} keybinding
 * @returns boolean
 */
export function matchKeybinding(event, keybinding) {
  const matchKey =
    event.key === keybinding.key ||
    event.code === keybinding.key ||
    event.code === keybinding.key.toUpperCase() ||
    event.keyCode === keybinding.key ||
    event.keyCode === keybinding.key.toUpperCase().charCodeAt();

  return (
    matchKey &&
    event.altKey === keybinding.alt &&
    event.ctrlKey === keybinding.ctrl &&
    event.metaKey === keybinding.meta &&
    event.shiftKey === keybinding.shift
  );
}
