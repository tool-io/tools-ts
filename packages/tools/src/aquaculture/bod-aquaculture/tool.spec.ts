import { describe, expect, it } from "vitest";
import { calculateBodAquaculture, example, runBodAquaculture } from "./tool.js";

describe("aquaculture/bod-aquaculture", () => {
  it("calculates the published example", () => {
    expect(calculateBodAquaculture(example.input)).toEqual(example.output);
    expect(runBodAquaculture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runBodAquaculture({
      ...example.input,
      initialOxygenMgPerLiter: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
