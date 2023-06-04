import { describe, it, expect } from 'vitest';

import { parseKeybinding, matchKeybinding } from './keys.js';

describe('parseKeybinding', () => {
  it('should parse a simple keybinding', () => {
    const keybinding = 'ctrl+c';
    const result = parseKeybinding(keybinding);
    expect(result).toEqual({
      key: 'c',
      alt: false,
      ctrl: true,
      meta: false,
      shift: false
    });
  });

  it('should parse a keybinding with multiple modifiers', () => {
    const keybinding = 'shift+alt+enter';
    const result = parseKeybinding(keybinding);
    expect(result).toEqual({
      key: 'Enter',
      alt: true,
      ctrl: false,
      meta: false,
      shift: true
    });
  });

  it('should ignore leading/trailing whitespace', () => {
    const keybinding = '  meta +  shift +  a  ';
    const result = parseKeybinding(keybinding);
    expect(result).toEqual({
      key: 'a',
      alt: false,
      ctrl: false,
      meta: true,
      shift: true
    });
  });

  it('should handle uppercase modifier keys', () => {
    const keybinding = 'CTRL+ALT+DELETE';
    const result = parseKeybinding(keybinding);
    expect(result).toEqual({
      key: 'Backspace',
      alt: true,
      ctrl: true,
      meta: false,
      shift: false
    });
  });

  it('should handle mixed case keybindings', () => {
    const keybinding = 'Ctrl+Shift+eNtEr';
    const result = parseKeybinding(keybinding);
    expect(result).toEqual({
      key: 'Enter',
      alt: false,
      ctrl: true,
      meta: false,
      shift: true
    });
  });
});

describe('matchKeybinding', () => {
  it('should match a keybinding with no modifiers', () => {
    const event = { key: 'a', altKey: false, ctrlKey: false, metaKey: false, shiftKey: false };
    const keybinding = { key: 'a', alt: false, ctrl: false, meta: false, shift: false };
    const result = matchKeybinding(event, keybinding);
    expect(result).toBe(true);
  });

  it('should match a keybinding with multiple modifiers', () => {
    const event = { key: 'enter', altKey: true, ctrlKey: false, metaKey: false, shiftKey: true };
    const keybinding = { key: 'enter', alt: true, ctrl: false, meta: false, shift: true };
    const result = matchKeybinding(event, keybinding);
    expect(result).toBe(true);
  });

  it('should not match a keybinding with incorrect modifiers', () => {
    const event = { key: 'a', altKey: true, ctrlKey: false, metaKey: false, shiftKey: false };
    const keybinding = { key: 'a', alt: false, ctrl: false, meta: false, shift: false };
    const result = matchKeybinding(event, keybinding);
    expect(result).toBe(false);
  });

  it('should not match a keybinding with incorrect key', () => {
    const event = { key: 'a', altKey: false, ctrlKey: false, metaKey: false, shiftKey: false };
    const keybinding = { key: 'b', alt: false, ctrl: false, meta: false, shift: false };
    const result = matchKeybinding(event, keybinding);
    expect(result).toBe(false);
  });
});
