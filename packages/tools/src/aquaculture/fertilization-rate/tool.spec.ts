import { describe, expect, it } from "vitest";
import {
  calculateFertilizationRate,
  example,
  runFertilizationRate,
} from "./tool.js";

describe("aquaculture/fertilization-rate", () => {
  it("calculates the published example", () => {
    expect(calculateFertilizationRate(example.input)).toEqual(example.output);
    expect(runFertilizationRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runFertilizationRate({
      ...example.input,
      fertilizedEggs: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runFertilizationRate({ ...example.input, eggsAssessed: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "eggsAssessed" }] },
    });
  });
});
