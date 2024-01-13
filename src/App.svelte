<script lang="ts">
  import Routes from "svelte-spa-router";

  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import NotFound from "./routes/NotFound.svelte";

  const routes = {
    "/": Home,
    "/about": About,
    "*": NotFound,
  };
</script>

<main class="text-gray-600">
  <nav>
    <ul class="flex flex-row">
      <li><a class="underline p-2" href="/#/">Home</a></li>
      <li><a class="underline p-2" href="/#/about">About</a></li>
    </ul>
  </nav>
  <Routes {routes} />
</main>
