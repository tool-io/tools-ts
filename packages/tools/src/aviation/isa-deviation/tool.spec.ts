import { describe, expect, it } from "vitest";
import {
  calculateIsaDeviation,
  isaDeviationExample,
  runIsaDeviation,
} from "./tool.js";

describe("isa deviation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIsaDeviation(isaDeviationExample.input)).toEqual({
      ok: true,
      output: isaDeviationExample.output,
    });
  });

  it("reports zero at ISA conditions", () => {
    const isa = runIsaDeviation({ altitudeFt: 5000, oatC: 5.094 });
    if (!isa.ok) throw new Error("expected success");
    expect(isa.output.deviationC).toBeCloseTo(0, 9);
  });

  it("measures against the clamped standard above the tropopause", () => {
    expect(calculateIsaDeviation({ altitudeFt: 40000, oatC: -50 })).toEqual({
      deviationC: 6.5,
    });
  });

  it("rejects negative altitudes through execution", () => {
    expect(runIsaDeviation({ altitudeFt: -1, oatC: 10 }).ok).toBe(false);
  });
});
