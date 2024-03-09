<script lang="ts">
    import Routes from 'svelte-spa-router'

    import AuthGard from './components/AuthGard.svelte'

    import Home from './routes/Home.svelte'
    import About from './routes/About.svelte'
    import NotFound from './routes/NotFound.svelte'
    import Navigation from './components/Navigation.svelte'
    import type { TNavEntry } from './ts/types'
    import Collection from './routes/Collection.svelte'
    import Definitions from './routes/Definitions.svelte'
    import Item from './routes/Item.svelte'
    import { errorStore } from './ts/stores/errorStore'
    import Popup from './components/Popup.svelte'

    const routes = {
        '/': Home,
        '/about': About,
        '/definitions': Definitions,
        '/collection/:collection': Collection,
        '/collection/:collection/create': Item,
        '/collection/:collection/item/:item': Item,
        '*': NotFound
    }

    const entries: TNavEntry[] = [
        { label: 'Home', path: '#/' },
        { label: 'About', path: '#/about' },
        { label: 'Definitions', path: '#/definitions' }
    ]

    const buttons = [
        {
            label: 'OK',
            onclick: () => {
                errorStore.set('')
            }
        }
    ]
</script>

<main class="text-gray-600 max-w-screen-xl m-auto">
    <AuthGard>
        <div class="grid grid-cols-5">
            <Navigation {entries} />
            <div class="col-span-4 p-8 h-screen">
                <div class="w-full">
                    {#if $errorStore !== ''}
                        <Popup
                            title="Errors"
                            desc={$errorStore}
                            {buttons}
                            type="error"
                        />
                    {/if}
                    <Routes {routes} />
                </div>
            </div>
        </div>
    </AuthGard>
</main>
