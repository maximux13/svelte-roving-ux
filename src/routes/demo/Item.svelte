<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let item;

  const dispatch = createEventDispatcher();

  let showActions = false;

  function clickOutside(node) {
    const handleClick = (event) => {
      if (node && !node.contains(event.target)) {
        showActions = false;
        event.stopPropagation();

        return;
      }
    };

    document.addEventListener('click', handleClick, true);

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<tr
  class="border-b border-slate-200/50 outline-none focus-visible:ring-2 ring-slate-400/50 ring-offset-2"
>
  <td class="w-10 p-3">
    <input type="checkbox" class="rounded-md" bind:checked={item.checked} />
  </td>
  <td class="p-3">
    {#if item.editable}
      <form
        class="flex gap-2"
        on:submit={(e) => {
          e.preventDefault();
          item.name = e.target[0].value;
          item.editable = false;
        }}
      >
        <input class="w-full" id="edit-{item.id}" type="text" value={item.name} />
        <button type="button" on:click={() => (item.editable = false)}>Cancel</button>
      </form>
    {:else}
      {item.name}
    {/if}
  </td>
  <td class="w-24 p-3">
    <span class="inline-flex items-center gap-2 rounded-full px-2 py-1 bg-slate-100">
      <i class="inline-block w-3 h-3 align-middle rounded-full bg-slate-300" />
      {item.status}
    </span>
  </td>
  <td class="w-14 p-3 text-right">
    <div class="relative">
      <button
        on:click={() => (showActions = !showActions)}
        class="inline-flex items-center gap-2 p-2 text-sm rounded-lg cursor-pointer bg-slate-100 text-slate-500"
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
            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
          />
        </svg>
      </button>
      {#if showActions}
        <nav
          class="absolute right-0 z-10 w-32 translate-y-full bg-white border rounded shadow-md ease-in-outright-0 -bottom-2"
          use:clickOutside
          in:fly={{ y: 10, duration: 100 }}
          out:fly={{ y: 10, duration: 100 }}
        >
          <ul class="p-0 group group-first:rounded-t group-first:rounded-b m-0 text-left">
            <li class="w-full focus-within:ring-1 ring-slate-200 hover:bg-slate-50">
              <button
                on:click={() => {
                  showActions = false;
                  dispatch('edit', item);
                }}
                class="w-full text-left px-4 py-2 outline-none">Edit</button
              >
            </li>
            <li class="w-full focus-within:ring-1 ring-slate-200 hover:bg-slate-50">
              <button
                on:click={() => {
                  showActions = false;
                  dispatch('delete', item);
                }}
                class="w-full text-left px-4 py-2 outline-none">Delete</button
              >
            </li>
          </ul>
        </nav>
      {/if}
    </div>
  </td>
</tr>
