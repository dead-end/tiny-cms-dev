## NPM

```sh
nvm use --lts
```

## Project installation

```sh
npm create vite@latest
✔ Project name: … tiny-cms-dev
✔ Select a framework: › Svelte
✔ Select a variant: › TypeScript

npm install svelte-spa-router
```

## Dependencies

For encryption

```sh
npm install byte-base64
```

Add the base configuration to`vite.config.ts` to get relative URL's:

```js
base: './'
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

## Markdown:

https://marked.js.org/

```sh
npm install marked
```

https://github.com/apostrophecms/sanitize-html

```sh
npm install -D @types/sanitize-html
npm install sanitize-html
```

https://github.com/tailwindlabs/tailwindcss-typography

Add to `tailwind.config.js`

```
  plugins: [
    require('@tailwindcss/typography'),
    // ...
  ],
```

npm install -D @tailwindcss/typography

# Github Graphql

## Get directory content

```
query getDirectoryListing($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    object(expression: "HEAD:collections/search-engine") {
      ... on Tree {
        entries {
          name
          type
          oid
        }
      }
    }
  }
}
```

You can replace `HEAD` with an explicit branch `object(expression: "main:collections/search-engine")`

## Get content of specific files in a directory

```
query getFilesContent($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    bing: object(expression: "HEAD:collections/search-engine/bing.json") {
      ... on Blob {
        text
        byteSize
        oid
      }
    }
    google: object(expression: "HEAD:collections/search-engine/google.json") {
      ... on Blob {
        text
        byteSize
        oid
      }
    }
  }
}
```

##

Get last commit of main branch (for a mutation)

```
query getFile($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    ref(qualifiedName: "refs/heads/main") {
      name
      target {
        ... on Commit {
          history(first: 1) {
            nodes {
              oid
            }
          }
        }
      }
    }
  }
}
```

Example:

https://iq.opengenus.org/api-requests-in-java/#apirequestforfileuploadorreupload
