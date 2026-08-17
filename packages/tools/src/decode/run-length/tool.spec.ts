import { describe, expect, it } from "vitest";
import { example, runDecodeRunLength } from "./tool.js";

describe("decode/run-length", () => {
  it("executes its canonical example", () => {
    expect(runDecodeRunLength(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects excessive run lengths", () => {
    expect(runDecodeRunLength({ encoded: "a100001" })).toMatchObject({
      ok: false,
    });
  });

  it("rejects zero-length runs", () => {
    expect(runDecodeRunLength({ encoded: "a0" })).toMatchObject({ ok: false });
  });
});
