import { describe, expect, it } from "vitest";
import {
  parallelResistanceExample,
  calculateParallelResistance,
  runParallelResistance,
} from "./tool.js";

describe("electricity/parallel-resistance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runParallelResistance(parallelResistanceExample.input)).toEqual({
      ok: true,
      output: parallelResistanceExample.output,
    });
  });
  it("rejects invalid input (insufficient_resistances)", () => {
    expect(runParallelResistance({ resistances: [] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_resistance)", () => {
    expect(runParallelResistance({ resistances: [10, 0] }).ok).toBe(false);
  });
  it("collapses equal resistors to resistance over the count", () => {
    const result = runParallelResistance({ resistances: [100, 100] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output).toEqual({
      conductanceTotal: 0.02,
      equivalentResistance: 50,
    });
  });

  it("passes a single resistor through unchanged", () => {
    const result = runParallelResistance({ resistances: [7] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.equivalentResistance).toBe(7);
  });
});
