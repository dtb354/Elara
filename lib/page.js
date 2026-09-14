/**
 * Shape every page module exports as its default. Annotating each page with
 * this typedef makes the editor flag a missing render() or a typo'd key.
 *
 * @typedef {object} Page
 * @property {string} name        Value written to body[data-page], used for CSS scoping.
 * @property {string} [styles]    Optional URL of the page's stylesheet.
 * @property {() => import("./html.js").SafeHtml} render
 */

export {};
