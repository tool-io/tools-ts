import { describe, expect, it } from "vitest";
import { example, runSigmoid } from "./tool.js";

describe("activation/sigmoid", () => {
  it("executes its canonical example", () => {
    expect(runSigmoid(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("remains finite for extreme inputs", () => {
    expect(runSigmoid({ x: -1000 })).toEqual({ ok: true, output: { y: 0 } });
    expect(runSigmoid({ x: 1000 })).toEqual({ ok: true, output: { y: 1 } });
  });
});
