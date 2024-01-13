```sh
npm create vite@latest
✔ Project name: … tiny-cms-dev
✔ Select a framework: › Svelte
✔ Select a variant: › TypeScript

npm install svelte-spa-router
```

## Install tailwind

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to `tailwind.config.js`:

```js
content: ["./src/**/*.{html,js,svelte,ts}"],
```

Add to `src/app.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Install tailwind forms:

```sh
npm install -D @tailwindcss/forms
```

Add to `tailwind.config.js`:

```js
  plugins: [require("@tailwindcss/forms")],
```
