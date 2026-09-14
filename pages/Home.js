import { html } from "../lib/html.js";

/** @type {import("../lib/page.js").Page} */
export default {
  name: "home",
  // Resolved relative to this module, not the HTML document.
  styles: new URL("./Home.css", import.meta.url).href,

  render() {
    return html`
      <h1>Home</h1>
      <p class="lede">This is a plain HTML/CSS/JS single-page app. Navigation swaps
      the content of <code>#app</code> instead of reloading the page,
      and the View Transitions API animates the swap.</p>
    `;
  },
};
