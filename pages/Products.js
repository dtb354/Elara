import { html } from "../lib/html.js";
import Card from "../components/Card.js";

const products = ["Widget A", "Widget B", "Widget C"];

/** @type {import("../lib/page.js").Page} */
export default {
  name: "products",
  styles: new URL("./Products.css", import.meta.url).href,

  render() {
    return html`
      <h1>Products</h1>
      <div class="product-grid">
        ${products.map(product => Card(product))}
      </div>
    `;
  },
};
