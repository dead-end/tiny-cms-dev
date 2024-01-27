<script lang="ts">
    import Routes from 'svelte-spa-router'

    import AuthGard from './components/AuthGard.svelte'

    import Home from './routes/Home.svelte'
    import About from './routes/About.svelte'
    import NotFound from './routes/NotFound.svelte'
    import Navigation from './components/Navigation.svelte'
    import type { TNavEntry } from './ts/types'
    import Collections from './routes/Collections.svelte'

    const routes = {
        '/': Home,
        '/about': About,
        '/collections': Collections,
        '*': NotFound
    }

    const entries: TNavEntry[] = [
        { label: 'Home', path: '#/' },
        { label: 'About', path: '#/about' },
        { label: 'Collections', path: '#/collections' }
    ]
</script>

<main class="text-gray-600 max-w-screen-xl m-auto">
    <AuthGard>
        <div class="grid grid-cols-5">
            <nav class="col-span-1 text-end bg-orange-200">
                <h1 class="text-2xl font-bold bg-gray-600 text-white py-6 pr-4">
                    Tiny CMS
                </h1>
                <div class="pr-4">
                    <Navigation {entries} />
                </div>
            </nav>
            <div class="col-span-4 bg-gray-50 p-8 h-screen">
                <div class="w-full">
                    <Routes {routes} />
                </div>
            </div>
        </div>
    </AuthGard>
</main>
