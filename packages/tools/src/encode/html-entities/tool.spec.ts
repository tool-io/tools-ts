import { describe, expect, it } from "vitest";
import { example, runEncodeHtmlEntities } from "./tool.js";

describe("encode/html-entities", () => {
  it("executes its canonical example", () => {
    expect(runEncodeHtmlEntities(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("escapes apostrophes", () => {
    expect(runEncodeHtmlEntities({ text: "Tool.io's" })).toEqual({
      ok: true,
      output: { encoded: "Tool.io&#39;s" },
    });
  });
});
