import { describe, expect, it } from "vitest";
import { example, runDecodeHtmlEntities } from "./tool.js";

describe("decode/html-entities", () => {
  it("executes its canonical example", () => {
    expect(runDecodeHtmlEntities(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("decodes decimal and hexadecimal numeric entities", () => {
    expect(runDecodeHtmlEntities({ text: "&#72;&#x69;" })).toEqual({
      ok: true,
      output: { text: "Hi" },
    });
  });
});
