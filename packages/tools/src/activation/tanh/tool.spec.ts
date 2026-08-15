import { describe, expect, it } from "vitest";
import { example, runTanh } from "./tool.js";

describe("activation/tanh", () => {
  it("executes its canonical example", () => {
    expect(runTanh(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("is odd around zero", () => {
    const positive = runTanh({ x: 2 });
    const negative = runTanh({ x: -2 });
    expect(positive.ok && negative.ok).toBe(true);
    if (!positive.ok || !negative.ok) return;
    expect(negative.output.y as number).toBe(-(positive.output.y as number));
  });
});
