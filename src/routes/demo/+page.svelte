<script>
  import { roving } from '$lib/index.js';
  import Item from './Item.svelte';

  let items = [
    {
      id: +new Date(),
      name: 'Item',
      status: 'To do',
      checked: false,
      editable: false
    },
    {
      id: +new Date() + 1,
      name: 'Item',
      status: 'To do',
      checked: false,
      editable: false
    }
  ];

  $: checked = items.filter((item) => item.checked);
</script>

<div class="grid text-left place-content-center">
  <section>
    <div class="max-w-2xl px-4 mx-auto lg:px-12">
      <h1 class="text-3xl font-bold text-slate-900">Roving tabindex</h1>

      <div class="text-xs space-y-3 text-slate-500">
        <p>
          Press <kbd class="bg-white shadow-sm p-1 rounded">Tab</kbd> to navigate inside the table and
          then use the arrow keys to navigate between the items.
        </p>
        <div>Press <kbd class="bg-white shadow-sm p-1 rounded">Enter</kbd> to edit an item.</div>
        <div>
          Press <kbd class="bg-white shadow-sm p-1 rounded">Enter</kbd> again to save the changes.
        </div>
        <div>
          Press <kbd class="bg-white shadow-sm p-1 rounded">Esc</kbd> to cancel the changes.
        </div>
        <div>
          Press <kbd class="bg-white shadow-sm p-1 rounded">Space</kbd> to toggle the checkbox.
        </div>
        <div>
          Press <kbd class="bg-white shadow-sm p-1 rounded">Backspace</kbd> to delete an item.
        </div>
        <br />
        <div>
          <strong>NOTE:</strong> keybindings are disabled when a form element is focused.
        </div>
      </div>

      <div class="w-full mt-4 text-right">
        <button
          disabled={!checked.length}
          class="disabled:opacity-40 bg-slate-200 px-4 py-2 rounded inline-flex gap-2 items-center text-sm"
          on:click={() => (items = items.filter((item) => !item.checked))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Delete ({checked.length})
        </button>
      </div>

      <table
        class="w-full text-sm bg-white border-collapse shadow-lg table-fixed not-prose rounded-md"
        use:roving={{
          target: 'tbody > tr',
          keybindings: {
            space: (_, index) => {
              items[index].checked = !items[index].checked;
            },
            delete: (_, index) => {
              items = items.filter((item) => item.id !== items[index].id);
            },
            escape: (_, index) => {
              items[index].editable = false;
            },
            enter: (_, index) => {
              items[index].editable = !items[index].editable;

              queueMicrotask(() => {
                const input = document.querySelector(`#edit-${items[index].id}`);
                input.focus();
              });
            }
          }
        }}
      >
        <thead>
          <tr class=" bg-slate-200/75">
            <th class="w-10 p-3 rounded-tl-md">
              <span />
            </th>
            <th class="w-full px-3 py-1 text-sm font-normal text-left">
              Backlog <span class="font-light text-slate-500">({items.length})</span>
            </th>
            <th class="w-24 p-3">
              <span />
            </th>
            <th class="w-14 py-3 px-3 text-right rounded-tr-md">
              <button
                aria-label="Add item"
                class="inline-flex items-center gap-2 p-2 text-sm rounded-lg bg-slate-100 text-slate-500"
                on:click={() =>
                  (items = [
                    ...items,
                    { id: +new Date(), name: `Item`, status: 'To do', editable: false }
                  ])}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="3"
                  stroke="currentColor"
                  class="w-4 h-4"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item.id)}
            <Item
              {item}
              on:delete={() => (items = items.filter((i) => i.id !== item.id))}
              on:edit={() => {
                item.editable = !item.editable;

                queueMicrotask(() => {
                  const input = document.querySelector(`#edit-${item.id}`);
                  input.focus();
                });
              }}
            />
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</div>
