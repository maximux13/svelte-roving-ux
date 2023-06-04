## Svelte Roving UX

![](https://img.shields.io/github/license/maximux13/svelte-roving-ux)
![](https://img.shields.io/npm/dm/@maximux13/svelte-roving-ux)
![](https://img.shields.io/npm/v/@maximux13/svelte-roving-ux)

## Introduction

This is a Svelte implementation of the [roving tabindex UX pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex). It is a simple way to manage focus in a list of items, such as a menu or a list of cards. additionally it allows you to provide a custom keyboard shortcut to interact with the selected item.

## Demo

You can find a demo [here](https://svelte-roving-ux.vercel.app/demo).

## Installation

```bash
pnpm install --save @maximux13/svelte-roving-ux
```

## Usage

To use this library in your Svelte project, first import it into your component:

```javascript
import roving from '@maximux13/svelte-roving-ux';
```

Then, add the `use:roving` directive to the parent element of the items you want to make focusable:

```svelte
<div use:roving>
  <button>Item 1</button>
  <button>Item 2</button>
  <button>Item 3</button>
</div>
```

This will make all direct child elements focusable. If you want to make only some of the child elements focusable or use other element to control the focus, you can use the `target` option:

```svelte
<div use:roving={{ target: 'button:not(.disabled)' }}>
  <button>Item 1</button>
  <button>Item 1</button>
  <button class="disabled">Item 2</button>
</div>
```

You can also use the `startIndex` option to set the index of the item that should be selected initially:

```svelte
<div use:roving={{ startIndex: 1 }}>
  <button>Item 1</button>
  <button>Item 2</button>
  <button>Item 3</button>
</div>
```

If you want to execute a callback function when an item is selected, you can use the `callback` option:

```svelte
<script>
  function callback(item, index, previous, next) {
    console.log(item, index, previous, next);
  }
</script>

<div use:roving={{ callback }}>
  <button>Item 1</button>
  <button>Item 2</button>
  <button>Item 3</button>
</div>
```

The callback function receives the following parameters:

- `item`: The selected item
- `index`: The index of the selected item
- `previous`: The index of the previously selected item
- `next`: The index of the next item that will be selected

If you want to use a custom keyboard shortcut to interact with the selected item, you can use the `keybindings` option:

```svelte
<script>
  function callback(item, index) {
    console.log(item, index);
  }

  const keybindings = {
    'ctrl+x': callback,
    'alt+y': callback
  };
</script>

<div use:roving={{ keybindings }}>
  <button>Item 1</button>
  <button>Item 2</button>
  <button>Item 3</button>
</div>
```

The keybindings object has the hotkey as key and the callback function as value. The callback function receives the following parameters:

- `item`: The selected item
- `index`: The index of the selected item

Supported modifiers are:

- `Alt` (or `Option`) (Mac only) => `alt`
- `Control` (or `Ctrl`) => `ctrl`
- `Meta` (or `Command`) (Mac only) => `meta`
- `Shift` => `shift`

Supported keys are:

- `A-Z`
- `0-9`
- `F1-F12`
- `ArrowUp` => `up`
- `ArrowDown` => `down`
- `ArrowLeft` => `left`
- `ArrowRight` => `right`
- `Enter` => `enter`
- `Space` => `space`
- `Backspace` => `delete`
- `Meta` => `meta` | `cmd` | `mod`

If you consider that a keybinding is missing, please open an issue or submit a pull request.

## Options

| Option      | Type     | Default | Description                                                                                                         |
| ----------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| target      | string   | null    | CSS selector for child elements that should be focusable. If null, all child elements are focusable                 |
| startIndex  | number   | 0       | Index of the item that should be selected initially                                                                 |
| callback    | function | null    | Callback function that is called when an item is selected. The function receives the item, index, previous and next |
| keybindings | object   | {}      | Object with keybindings. The key is the hotkey that is pressed and the value is the callback function               |

## Contributing

We welcome contributions to this project! To get started, please follow these steps:

1. Fork this repository to your own account.
2. Clone your forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes and commit them with a descriptive message.
5. Push your changes to your forked repository.
6. Submit a pull request to the main repository.

Please ensure that your code adheres to our coding standards and passes our automated tests before submitting a pull request. We also recommend that you open an issue to discuss your proposed changes before starting work on a pull request.

Thank you for your contributions to this project!

## Acknowledgements

This library was inspired by the following libraries:

- [roving-ux](https://www.npmjs.com/package/roving-ux)
- [toukey](https://www.npmjs.com/package/toukey)

We would like to thank the authors of these libraries for their contributions to the open source community.

## License

This project is licensed under the MIT License.
