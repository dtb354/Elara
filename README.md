# Elara SPA

A single-page app with no framework and no build step. Routing is the hash API,
page transitions use the native View Transitions API, and pages are ES modules
that return HTML.

## Running it

ES modules are blocked on `file://`, so the app must be served over HTTP.
Opening the HTML by double-clicking will fail with a CORS error.

Use the Live Server extension (right-click `spa-view-transitions-demo.html` →
**Open with Live Server**), or any static server:

```bash
npx serve .
# or
python -m http.server 8000
```

## Editor setup

Install the recommended extensions when VS Code prompts, or:

```
ext install runem.lit-plugin
```

This validates the HTML inside `` html`...` `` templates — unclosed tags,
unknown tag names, bad attributes — and adds highlighting and autocomplete.

`jsconfig.json` enables `checkJs` and `strict`, so the JavaScript is
type-checked from JSDoc comments. To run the same check in a terminal:

```bash
npx -p typescript tsc -p jsconfig.json
```

## Layout

```
spa-view-transitions-demo.html   Entry point: nav, #app container, module script
app.js                           Router: route table, CSS loading, view swapping
styles.css                       Shared base: tokens, nav, layout, transitions
lib/html.js                      html`` tagged template (auto-escaping) + raw()
lib/page.js                      Page typedef used by every page module
components/Card.js               Reusable snippets
pages/Home.js, Home.css          One module + one stylesheet per page
```

## Adding a page

**1. Create `pages/Contact.js`:**

```js
import { html } from "../lib/html.js";

/** @type {import("../lib/page.js").Page} */
export default {
  name: "contact",
  styles: new URL("./Contact.css", import.meta.url).href,

  render() {
    return html`
      <h1>Contact</h1>
      <p>Say hello.</p>
    `;
  },
};
```

`name` is what lands in `body[data-page]`. `styles` is optional — omit it and
the page just uses the shared base (see `pages/NotFound.js`).

**2. Create `pages/Contact.css`,** scoping every selector to the page:

```css
body[data-page="contact"] h1 {
  color: var(--accent);
}
```

**3. Register the route in `app.js`:**

```js
import Contact from "./pages/Contact.js";

const routes = {
  // ...
  "/contact": Contact,
};
```

**4. Add the nav link** in `spa-view-transitions-demo.html`:

```html
<a href="#/contact" data-link>Contact</a>
```

## Conventions

**Import paths need the `.js` extension.** Browsers don't resolve
`./pages/Home` the way a bundler would.

**Build markup with the `html` tag, not bare template literals.** Interpolated
values are escaped automatically, so user data can't inject markup:

```js
html`<p>${userInput}</p>`   // escaped
```

Values that are already `html` results pass through unescaped, so components
nest without double-escaping. To insert trusted markup from a plain string, opt
out explicitly with `raw()` — never pass user input to it.

**Scope page CSS under `body[data-page="..."]`.** Stylesheets are loaded once
and stay in the document; the attribute is what keeps one page's rules from
matching another's elements. Because the attribute sits on `<body>`, page CSS
can also override shared layout — `pages/Products.css` widens `#app` for its
grid.

**Put anything shared in `styles.css`** — design tokens, nav, base layout, the
view-transition animations.

## How the router works

`render(path)` in `app.js`:

1. Looks up the page, falling back to `NotFound`.
2. Marks the active nav link.
3. Awaits that page's stylesheet — loading it *before* the swap, otherwise the
   page animates in unstyled and reflows mid-transition. Each file loads once.
4. Bails out if a newer navigation started while the CSS was loading.
5. Sets `body[data-page]` and swaps `#app.innerHTML` inside
   `document.startViewTransition()`, falling back to an instant swap where the
   API is unsupported.

## Known limitations

- **Hash-based routing** (`#/about`), chosen so the app works from any static
  host and in sandboxed preview environments. Switching to the History API
  means adding a server rewrite so deep links don't 404.
- **Full re-render on navigation.** Every swap replaces all of `#app`; there is
  no diffing and no component state. Fine at this size.
- **View Transitions are progressive enhancement.** Unsupported browsers get an
  instant swap, which is correct but unanimated.
- **Formatters skip template contents.** Prettier only formats `html` templates
  it recognizes as lit's, so indentation inside them is manual.
