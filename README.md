# posthtml-rtl

A flexible utility to convert your HTML to RTL and vice versa.

## Introduction

`posthtml-rtl` converts the CSS embedded in HTML files as style tags or inline-style attribute by utilizing [rtlcss](https://github.com/MohammadYounes/rtlcss). The attributes `align` and `dir` are flipped as well. Furthermore, the package provide a way to ignore, remove or overwrite attributes.

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

## Installation

Install as local dependency using `npm`:

```bash
npm install --save posthtml-rtl
```

or using `yarn`:

```bash
yarn add posthtml-rtl
```

Install as CLI command:

```bash
npm install --global posthtml-rtl
```

## Usage

### CLI Utility

```bash
posthtml-rtl <file>
```

#### CLI flags

```
  --help          Display help instructions
  --rtl           Output RTL HTML (true by default)
  -o, --output    Path to write output (optional)
```

By default the CLI utility reads `stdin` as input

```base
echo '<html dir="rtl"></html>' | posthtml-rtl
```

Or by providing input file as an argument

```base
posthtml-rtl ./index.html
```

You can also specify an output file using `output` flag:

```base
posthtml-rtl ./index.html --output=./ar/index.html
```

The `rtl` flag determine weather the output should be converted to RTL or not.

For example `index.html` contains

```html
<html dir="ltr" lang="en-US" data-rtl-lang="ar-AE" data-ltr-remove="dir"></html>
```

When running the utility with `rtl` is `true`

```bash
  posthtml-rtl --rtl=true index.html
```

Outputs

```html
<html dir="rtl" lang="ar-AE"></html>
```

And when `rtl` is `false`

```bash
  posthtml-rtl --rtl=true index.html
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
console.log(result);
```

Or in asynchronous way

```js
posthtmlRtl.process(inputHtml, config).then(result => {
  console.log(result.html);
});
```

Or as posthtml plugin

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