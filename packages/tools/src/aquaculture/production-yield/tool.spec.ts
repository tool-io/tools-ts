import { describe, expect, it } from "vitest";
import {
  calculateProductionYield,
  example,
  runProductionYield,
} from "./tool.js";

describe("aquaculture/production-yield", () => {
  it("calculates the published example", () => {
    expect(calculateProductionYield(example.input)).toEqual(example.output);
    expect(runProductionYield(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runProductionYield({
      ...example.input,
      harvestedBiomassKilograms: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runProductionYield({ ...example.input, productionAreaHectares: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "productionAreaHectares" }] },
    });
  });
});
