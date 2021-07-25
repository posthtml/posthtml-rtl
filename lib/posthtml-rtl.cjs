const rtlcss = require("rtlcss");
const _ = require("lodash");

// Regex pattern that will be used to match HTML attributes
const attributePattern = /^data-(?<dir>rtl|ltr)-(?:(?<action>ignore|remove)|(?<attr>[a-z-]+))$/;

// Default map to flip attributes
const defaultMap = {
  dir: {
    ltr: "rtl",
    rtl: "ltr",
  },
  align: {
    left: "right",
    right: "left",
  },
};

/**
 * Creates a posthtml node handler
 * @param {{ rtl, flip, flipAttrs, rtlcss }} inputs
 * @returns {Function}
 */
const createNodeHandler = ({ rtl, flip, flipAttrs, rtlcss }) => {
  const reduceConfig = (result, value, key) => {
    const matches = key.match(attributePattern);
    if (matches === null) {
      result.attrs[key] = value;
      return result;
    }

    const {
      groups: { dir, action, attr },
    } = matches;

    // If attribute direction matches options direction
    if ((dir === "rtl" && rtl) || (dir === "ltr" && !rtl)) {
      if (action) {
        // If action is given (e.g. data-ltr-remove data-rtl-ignore="dir align")
        // Set action value in nodeOptions
        result[action] = value === "" ? true : value.split(" ");
        return result;
      }

      if (attr) {
        // If attribute overwrite value is given (e.g. height="30px" data-rtl-height="20px")
        result.overwrite[attr] = value;
        return result;
      }
    }

    return result;
  };

  return node => {
    // Skip text/comments
    if (typeof node !== "object") return node;
    const config = _.reduce(node.attrs, reduceConfig, { attrs: [], overwrite: [], remove: [], ignore: [] });

    // If node should be removed
    if (config.remove === true) return null;

    // If node should be ignored
    if (config.ignore === true) return { ...node, attrs: config.attrs };

    // Removed attributes
    config.attrs = _.omit(config.attrs, config.remove);

    // Remove ignored attributes from overwrite
    config.overwrite = _.omit(config.overwrite, [...config.remove, ...config.ignore]);

    // Convert RTL
    if (rtl) {
      // Flip attributes according to provided map
      config.attrs = _.reduce(
        config.attrs,
        (result, value, key) => {
          result[key] = flipAttrs.includes(key) && !config.ignore.includes(key) ? flip(key, value) : value;
          return result;
        },
        {}
      );

      // Convert style attribute
      if (config.attrs.style && !config.ignore.includes("style")) {
        config.attrs.style = rtlcss(config.attrs.style);
      }

      // Convert style tag
      if (node.tag === "style") {
        node.content = [rtlcss(node.content.toString())];
      }
    }

    // Return posthtml node
    return {
      ...node,
      attrs: { ...config.attrs, ...config.overwrite },
    };
  };
};

/**
 * Return Rtlcss instance depending on input configuration
 * @param {Array|Object|Function} optionsRtlcss An object containing posthtml-rtl settings.
 * @returns {Function} A string containing the output.
 */
const getRtlcssInstance = optionsRtlcss => {
  if (optionsRtlcss) {
    switch (typeof optionsRtlcss) {
      case "function":
        return optionsRtlcss;

      case "object":
        if (Array.isArray(optionsRtlcss)) {
          return css => rtlcss.process(css, ...optionsRtlcss);
        }

        return css => rtlcss.process(css, optionsRtlcss);

      default:
        return css => rtlcss.process(css);
    }
  }

  return css => rtlcss.process(css);
};

/**
 * Creates a new posthtml-rtl instance.
 * @param {Object} map An object containing a map of attributes and its values
 * @returns {(attribute:string, value:string) => string} a function that takes attribute and value returning the flipped values
 */
const createFlipInstance = map => (attr, value) => map[attr]?.[value] || value;

/**
 * Creates a new posthtml-rtl instance.
 * @param {{ rtl?: boolean, map?: Object, rtlcss?: {Array|Object|Function} }} options An object containing posthtml-rtl settings.
 * @returns {Function} A string containing the output.
 */
const posthtmlRtl = ({ rtl = true, map = defaultMap, rtlcss: optionsRtlcss } = {}) => {
  const rtlcss = getRtlcssInstance(optionsRtlcss);
  const flip = createFlipInstance(map);

  // Posthtml node handler
  const handleNode = createNodeHandler({ rtl, flip, flipAttrs: Object.keys(map), rtlcss });

  return tree =>
    // Go through the HTML nodes
    tree.walk(handleNode);
};

module.exports = posthtmlRtl;
