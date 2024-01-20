<script lang="ts">
    import Routes from 'svelte-spa-router'

    import AuthGard from './components/AuthGard.svelte'

    import Home from './routes/Home.svelte'
    import About from './routes/About.svelte'
    import NotFound from './routes/NotFound.svelte'
    import Navigation from './components/Navigation.svelte'
    import type { TNavEntry } from './ts/types'

    const routes = {
        '/': Home,
        '/about': About,
        '*': NotFound
    }

    const entries: TNavEntry[] = [
        { label: 'Home', path: '#/' },
        { label: 'About', path: '#/about' }
    ]
</script>

<main class="text-gray-700 max-w-screen-xl m-auto">
    <AuthGard>
        <div class="grid grid-cols-5">
            <nav class="col-span-1 text-end py-6 pr-4">
                <h1 class="text-2xl font-bold">Tiny CMS</h1>
                <Navigation {entries} />
            </nav>
            <div class="col-span-4 bg-gray-50 py-6 h-screen">
                <div class="w-full max-w-xs m-auto">
                    <Routes {routes} />
                </div>
            </div>
        </div>
    </AuthGard>
</main>
