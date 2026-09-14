import { html } from "../lib/html.js";

/** @type {import("../lib/page.js").Page} */
export default {
  name: "not-found",
  // No styles key: pages without their own CSS just use the shared base.

  render() {
    return html`
      <h1>404</h1>
      <p>Page not found.</p>
    `;
  },
};
