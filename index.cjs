const posthtml = require("posthtml");
const posthtmlRtl = require("./lib/posthtml-rtl.cjs");

/**
 * Creates a new posthtml-rtl instance, use posthtml to process the input and return its result.
 *
 * @async
 * @param {String} html A string containing input HTML.
 * @param {{ rtl?: boolean, map?: Object, rtlcss?: {Array|Object|Function} }} options An object containing posthtml-rtl settings.
 * @param {Object} posthtmlOptions An object containing posthtml settings.
 * @returns {*} A string containing the output.
 */
posthtmlRtl.process = (html, options, posthtmlOptions) => posthtml().use(posthtmlRtl(options)).process(html, posthtmlOptions);

module.exports = posthtmlRtl;
