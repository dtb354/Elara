import { html } from "../lib/html.js";

/** @type {import("../lib/page.js").Page} */
export default {
  name: "about",
  styles: new URL("./About.css", import.meta.url).href,

  render() {
    return html`
      <h1>About</h1>
      <div class="card">
        <strong>No framework.</strong>
        <p class="muted">Just the History API for routing and the
        View Transitions API for the fade/slide effect you're seeing.</p>
      </div>
    `;
  },
};
