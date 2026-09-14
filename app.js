import Home from "./pages/Home.js";
import About from "./pages/About.js";
import Products from "./pages/Products.js";
import NotFound from "./pages/NotFound.js";

// Each page lives in its own module and exports { name, styles, render }.
/** @type {Record<string, import("./lib/page.js").Page>} */
const routes = {
  "/": Home,
  "/about": About,
  "/products": Products,
};

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function mustFind(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id} element`);
  return element;
}

const app = mustFind("app");

/** @type {Set<string>} */
const loadedStyles = new Set();

// Page stylesheets are fetched once and then left in place; the data-page
// scoping in each file keeps inactive pages' rules from matching anything.
/**
 * @param {string} [href]
 * @returns {Promise<void>}
 */
function loadStyles(href) {
  if (!href || loadedStyles.has(href)) return Promise.resolve();
  loadedStyles.add(href);

  return new Promise(resolve => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    // Resolve on error too, so a missing file never blocks navigation.
    link.addEventListener("load", () => resolve(), { once: true });
    link.addEventListener("error", () => resolve(), { once: true });
    document.head.append(link);
  });
}

/** @param {string} path */
async function render(path) {
  const page = routes[path] ?? NotFound;

  document.querySelectorAll("#nav a").forEach(link => {
    const linkPath = (link.getAttribute("href") ?? "").slice(1) || "/";
    link.classList.toggle("active", linkPath === path);
  });

  // Wait for the CSS before swapping, otherwise the new page animates in
  // unstyled and then reflows once the stylesheet lands.
  await loadStyles(page.styles);

  // A faster navigation may have overtaken this one while the CSS loaded.
  if (currentPath() !== path) return;

  const update = () => {
    document.body.dataset.page = page.name;
    app.innerHTML = String(page.render());
  };

  // Fall back to an instant swap in browsers without View Transitions support.
  if (document.startViewTransition) {
    document.startViewTransition(update);
  } else {
    update();
  }
}

// Set the hash explicitly so navigation also works in sandboxed preview environments.
document.addEventListener("click", event => {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest("a[data-link]");
  if (!link) return;

  event.preventDefault();
  const path = (link.getAttribute("href") ?? "").slice(1) || "/";
  if (location.hash.slice(1) !== path) {
    location.hash = path;
  }
});

function currentPath() {
  const hash = location.hash.slice(1);
  return hash === "" ? "/" : hash;
}

window.addEventListener("hashchange", () => render(currentPath()));
render(currentPath());
