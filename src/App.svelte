<script lang="ts">
    import Routes from 'svelte-spa-router'

    import AuthGard from './components/AuthGard.svelte'

    import Home from './routes/Home.svelte'
    import About from './routes/About.svelte'
    import NotFound from './routes/NotFound.svelte'
    import Navigation from './components/Navigation.svelte'
    import type { TNavEntry } from './ts/types'
    import Collections from './routes/Collections.svelte'
    import Collection from './routes/Collection.svelte'
    import Definitions from './routes/Definitions.svelte'
    import Item from './routes/Item.svelte'
    import ErrorShow from './components/ErrorShow.svelte'

    const routes = {
        '/': Home,
        '/about': About,
        '/definitions': Definitions,
        '/collections': Collections,
        '/collections/:collection': Collection,
        '/collections/:collection/:item': Item,
        '*': NotFound
    }

    const entries: TNavEntry[] = [
        { label: 'Home', path: '#/' },
        { label: 'About', path: '#/about' },
        { label: 'Definitions', path: '#/definitions' },
        { label: 'Collections', path: '#/collections' }
    ]
</script>

<main class="text-gray-600 max-w-screen-xl m-auto">
    <AuthGard>
        <div class="grid grid-cols-5">
            <Navigation {entries} />
            <div class="col-span-4 p-8 h-screen">
                <div class="w-full">
                    <ErrorShow />
                    <Routes {routes} />
                </div>
            </div>
        </div>
    </AuthGard>
</main>
