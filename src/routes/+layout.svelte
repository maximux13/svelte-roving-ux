<script>
  import '../app.css';
  import '../theme.css';

  import { dev } from '$app/environment';
  import { inject } from '@vercel/analytics';

  inject({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
  <title>Svelte Roving UX | Demo</title>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⌨️</text></svg>"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&family=Quicksand&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div
  class="flex flex-col min-h-screen justify-between items-center max-w-4xl mx-auto font-sans prose prose-h1:font-serif"
>
  <main class="flex-1 grid px-4 py-8 place-items-center">
    <slot />
  </main>

  <footer class="p-6">
    <div class="text-center text-xs text-slate-500">
      <p class="text-center">Made by <a href="https://github.com/maximux13/">@maximux13</a></p>
    </div>
  </footer>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.slate.50);
  }
</style>
