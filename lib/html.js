/**
 * Markup that has already been escaped (or is trusted) and can be inserted as-is.
 */
export class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

/** @type {Record<string, string>} */
const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * @param {unknown} value
 * @returns {string}
 */
function escape(value) {
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(escape).join("");
  if (value === null || value === undefined || value === false) return "";
  return String(value).replace(/[&<>"']/g, char => ESCAPES[char]);
}

/**
 * Tagged template for markup. Interpolated values are escaped unless they are
 * already SafeHtml, so nesting components composes without double-escaping.
 *
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {SafeHtml}
 */
export function html(strings, ...values) {
  return new SafeHtml(
    strings.reduce((out, string, i) => out + escape(values[i - 1]) + string)
  );
}

/**
 * Opt out of escaping for markup you control. Never pass user input here.
 *
 * @param {string} value
 * @returns {SafeHtml}
 */
export function raw(value) {
  return new SafeHtml(value);
}
