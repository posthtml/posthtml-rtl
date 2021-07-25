import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import test from "ava";
import posthtmlRtl from "../index.cjs";

const process = (input, options) => posthtmlRtl.process(input, options, { sync: true }).html;
const currentPage = path.dirname(url.fileURLToPath(import.meta.url));

const mainExample = fs.readFileSync(path.join(currentPage, "../examples/main.html"), "utf-8");
const expectedLtr = fs.readFileSync(path.join(currentPage, "./example-ltr.html"), "utf-8");
const expectedRtl = fs.readFileSync(path.join(currentPage, "./example-rtl.html"), "utf-8");

test("Example main.html - LTR", t => {
  t.is(process(mainExample, { rtl: false }), expectedLtr);
});

test("Example main.html - RTL", t => {
  t.is(process(mainExample, { rtl: true }), expectedRtl);
});

test("<style> tag - LTR", t => {
  const input = `<style>.foo { direction: ltr; }</style>`;
  const expected = `<style>.foo { direction: ltr; }</style>`;
  t.is(process(input, { rtl: false }), expected);
});

test("<style> tag - RTL", t => {
  const input = `<style>.foo { direction: ltr; }</style>`;
  const expected = `<style>.foo { direction: rtl; }</style>`;
  t.is(process(input, { rtl: true }), expected);
});

test("style attribute - LTR", t => {
  const input = `<style>.foo { float: left; }</style>`;
  const expected = `<style>.foo { float: left; }</style>`;
  t.is(process(input, { rtl: false }), expected);
});

test("style attribute - RTL", t => {
  const input = `<style>.foo { float: left; }</style>`;
  const expected = `<style>.foo { float: right; }</style>`;
  t.is(process(input, { rtl: true }), expected);
});

test("dir and align attributes - LTR", t => {
  const input = `<div dir="ltr" align="left"></div>`;
  const expected = `<div dir="ltr" align="left"></div>`;
  t.is(process(input, { rtl: false }), expected);
});

test("dir and align attributes - RTL", t => {
  const input = `<div dir="ltr" align="left"></div>`;
  const expected = `<div dir="rtl" align="right"></div>`;
  t.is(process(input, { rtl: true }), expected);
});
