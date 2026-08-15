import { describe, expect, it } from "vitest";
import { example, runLeakyRelu } from "./tool.js";

describe("activation/leaky-relu", () => {
  it("executes its canonical example", () => {
    expect(runLeakyRelu(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("preserves calculation precision", () => {
    expect(runLeakyRelu({ alpha: 0.001, x: -1.234 })).toEqual({
      ok: true,
      output: { y: -0.001234 },
    });
  });
});
