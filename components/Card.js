import { html } from "../lib/html.js";

/**
 * Reusable snippet, the same way you'd write a small presentational component.
 *
 * @param {unknown} content
 */
export default function Card(content) {
  return html`<div class="card">${content}</div>`;
}
