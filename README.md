## Project installation

```sh
npm create vite@latest
✔ Project name: … tiny-cms-dev
✔ Select a framework: › Svelte
✔ Select a variant: › TypeScript

npm install svelte-spa-router
```

Add the base configuration to`vite.config.ts` to get relative URL's:

```js
base: "./";
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

## Deploy to github pages

``sh
npm install gh-pages --save-dev

````

Add file: `gh-pages.js` with:

```js
import ghpages from "gh-pages";

ghpages.publish(
  "dist", // path to public directory
  {
    branch: "main",
    repo: "https://github.com/dead-end/tiny-cms.git",
  },
  () => {
    console.log("Deploy Complete!");
  }
);

````

Add to package.json

```js
"deploy": "node ./gh-pages.js",
```

## Deploy to Github

To deploy to Github pages:

```sh
npm run build
npm run deploy
```
