import { describe, expect, it } from "vitest";
import { example, runSoftmax } from "./tool.js";

describe("activation/softmax", () => {
  it("executes its canonical example", () => {
    expect(runSoftmax(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("produces a stable probability distribution", () => {
    const result = runSoftmax({ values: [1000, 1001, 1002] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const probabilities = result.output.probabilities as number[];
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(
      1,
      14,
    );
    expect(probabilities.every(Number.isFinite)).toBe(true);
  });

  it("rejects an empty score list", () => {
    expect(runSoftmax({ values: [] })).toMatchObject({ ok: false });
  });
});
