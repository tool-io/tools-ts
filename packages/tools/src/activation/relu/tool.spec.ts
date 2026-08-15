import { describe, expect, it } from "vitest";
import { example, runRelu } from "./tool.js";

describe("activation/relu", () => {
  it("executes its canonical example", () => {
    expect(runRelu(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("floors negative values at zero", () => {
    expect(runRelu({ x: -7.5 })).toEqual({ ok: true, output: { y: 0 } });
  });
});
