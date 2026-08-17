import { describe, expect, it } from "vitest";
import { example, runEncodeRunLength } from "./tool.js";

describe("encode/run-length", () => {
  it("executes its canonical example", () => {
    expect(runEncodeRunLength(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects digits because they are count delimiters", () => {
    expect(runEncodeRunLength({ text: "abc2" })).toMatchObject({ ok: false });
  });
});
