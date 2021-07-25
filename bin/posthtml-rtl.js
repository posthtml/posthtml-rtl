#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import meow from "meow";
import getStdin from "get-stdin";
import posthtmlRtl from "../index.cjs";

const currentFile = path.dirname(url.fileURLToPath(import.meta.url));
const helpText = fs.readFileSync(path.join(currentFile, "./help.txt"), "utf-8").toString();

const processSync = (input, options) => posthtmlRtl.process(input, options, { sync: true }).html;

const cli = meow(helpText, {
  importMeta: import.meta,
  flags: {
    rtl: {
      type: "boolean",
      default: true,
    },
    output: {
      type: "string",
      alias: "o",
    },
  },
});

const { rtl, output } = cli.flags;

(async () => {
  let htmlInput;

  // Read from stdin if input file is not provided
  if (cli.input.length > 0) {
    const inputFile = cli.input[0];
    try {
      htmlInput = fs.readFileSync(inputFile, "utf-8").toString();
    } catch (error) {
      process.stderr.write(`Error occurred while trying to read the input file "${error.toString()}".\n`);
      process.exit(1);
    }
  } else {
    htmlInput = await getStdin();
  }

  // Process input and save to output file if provided, otherwise write to stdout
  const htmlOutput = processSync(htmlInput, { rtl });
  if (output) {
    try {
      fs.writeFileSync(output, htmlOutput);
    } catch (error) {
      process.stderr.write(`Error occurred while trying to write the output file "${error.toString()}".\n`);
      process.exit(1);
    }
  } else {
    process.stdout.write(htmlOutput);
  }
})();
