# posthtml-rtl

A flexible utility to convert HTML to RTL (right to left) and vice versa.

## Introduction

`posthtml-rtl` converts the CSS embedded in HTML files such as internal style tags and inline style attributes using [rtlcss](https://github.com/MohammadYounes/rtlcss). Moreover, the attributes `align` and `dir` are mirrored. Furthermore, the package provide a way to ignore, remove or overwrite tags/attributes.

An example showing the input and output of `posthtml-rtl`:

```html
<!-- Input -->
<html dir="ltr" lang="en-US" data-rtl-lang="ar-AE">
  <head>
    <style>
      .foo {
        float: left;
      }
    </style>
  </head>
  <body>
    <table style="margin-left: 20px">
      <tbody>
        <tr>
          <td align="right">1</td>
          <td align="left">2</td>
          <td align="left" data-rtl-ignore>3</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

<!-- RTL output -->
<html dir="rtl" lang="ar-AE">
  <head>
    <style>
      .foo {
        float: right;
      }
    </style>
  </head>
  <body>
    <table style="margin-right: 20px">
      <tbody>
        <tr>
          <td align="left">1</td>
          <td align="right">2</td>
          <td align="left">3</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>

<!-- LTR output -->
<html dir="ltr" lang="en-US">
  <head>
    <style>
      .foo {
        float: left;
      }
    </style>
  </head>
  <body>
    <table style="margin-left: 20px">
      <tbody>
        <tr>
          <td align="right">1</td>
          <td align="left">2</td>
          <td align="left">3</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
```

## Use Cases

This tools is useful for the following cases:

- Convert HTML email templates to RTL.
- Convert static HTML website to RTL (in combination with [rtlcss](https://github.com/MohammadYounes/rtlcss) for external CSS files).
- As a part of your website HTML generation; this package can be used in combination with template engine like `pug` and internationalization library like `i18next` to support RTL locales interface in multi-language websites.

## Installation

Install as local dependency using `npm`:

```bash
npm install --save posthtml-rtl
```

or using `yarn`:

```bash
yarn add posthtml-rtl
```

Install as CLI utility:

```bash
npm install --global posthtml-rtl
```

## Usage

### CLI Utility

```bash
posthtml-rtl <file>
```

Flags

```
  --help          Display help instructions
  --rtl           Output RTL HTML (true by default)
  -o, --output    Path to write output (optional)
```

By default the CLI utility reads `stdin` as input and dump the output into `stdout`

```bash
echo '<html dir="rtl"></html>' | posthtml-rtl
```

You can provide input file as an argument

```bash
posthtml-rtl ./index.html
```

You can also specify an output file with `output` flag:

```bash
posthtml-rtl ./index.html --output=./ar/index.html
```

The `rtl` flag determine weather the output should be converted to RTL or not.

For example `index.html` contains

```html
<html dir="ltr" lang="en-US" data-rtl-lang="ar-AE" data-ltr-remove="dir"></html>
```

When running the utility with `rtl` flag as `true`

```bash
  posthtml-rtl --rtl=true index.html
```

Outputs

```html
<html dir="rtl" lang="ar-AE"></html>
```

And when `rtl` is `false`

```bash
  posthtml-rtl --rtl=false index.html
```

Outputs

```html
<html lang="en-US"></html>
```

### Node.js

```js
const posthtmlRtl = require("posthtml-rtl");

const inputHtml = `<html dir="ltr"></html>`;
const config = { rtl: true };
const posthtmlConfig = { sync: true };

const result = posthtmlRtl.process(inputHtml, config, posthtmlConfig);
console.log(result.html);
```

Or in asynchronous way

```js
posthtmlRtl.process(inputHtml, config).then(result => {
  console.log(result.html);
});
```

Or as `posthtml` plugin

```js
const posthtml = require("posthtml");
const posthtmlRtl = require("posthtml-rtl");

const inputHtml = `<html dir="ltr"></html>`;

posthtml()
  .use(posthtmlRtl(/* options */))
  .process(inputHtml, {} /* posthtml options */)
  .then(result => {
    console.log(result.html);
  });
```

### Options

| Option | Type                      | Default Value              | Description                                                  |
| ------ | ------------------------- | -------------------------- | ------------------------------------------------------------ |
| rtl    | Boolean                   | true                       | if true the output will be converted to RTL                  |
| map    | Object                    | written below this section | The map used to flip html attributes like `dir` and `align`  |
| rtlcss | Function, array or object | Instance of `rtlcss`       | Provide a function to convert css to RTL or `rtlcss` options |

#### Default attributes map

```json
{
  "dir": {
    "ltr": "rtl",
    "rtl": "ltr"
  },
  "align": {
    "left": "right",
    "right": "left"
  }
}
```

## Control Output

The package provide a way to ignore, remove and overwrite attributes. by using dataset attributes `data-$dir-$action`. where `$dir` is `rtl` or `ltr` and `$action` is `remove`, `ignore` or attribute name to overwrite.

### Ignoring

To ignore tag use `data-$dir-ignore` attribute, for example:

```html
<!-- input -->
<html>
  <style data-rtl-ignore>
    .foo {
      float: left;
    }
  </style>
</html>

<!-- RTL output -->
<html>
  <style>
    .foo {
      float: left;
    }
  </style>
</html>
```

To ignore specific attribute, you can pass a list of attributes to `data-$dir-ignore` separated by by space, for example:

```html
<!-- input -->
<html dir="ltr" align="left" style="margin-left: 10px;" data-rtl-ignore="dir align"></html>

<!-- RTL output -->
<html dir="ltr" align="left" style="margin-right: 10px;"></html>
```

### Removing

To remove tag use `data-$dir-remove` attribute, for example:

```html
<!-- input -->
<style data-ltr-remove>
  img {
    transform: scaleX(-1);
  }
</style>
<img src="picture.jpg" />

<!-- RTL output -->
<style>
  img {
    transform: scaleX(-1);
  }
</style>
<img src="picture.jpg" />

<!-- LTR output -->
<img src="picture.jpg" />
```

To remove specific attribute, you can pass a list of attributes to `data-$dir-remove` separated by by space, for example:

```html
<!-- input -->
<html dir="ltr" data-ltr-remove="dir"></html>

<!-- RTL output -->
<html dir="rtl"></html>

<!-- LTR output -->
<html></html>
```

### Overwriting

You can overwrite any attribute using `data-$dir-$attr` where `$attr` is the attribute that you want to overwrite, for example:

```html
<!-- input -->
<img src="logo.png" data-rtl-src="logo-ar.png" />

<!-- RTL output -->
<img src="logo-ar.png" />

<!-- LTR output -->
<img src="logo.png" />
```