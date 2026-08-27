import { describe, expect, it } from "vitest";
import {
  calculateSmNdIsochron,
  smNdIsochronExample,
  runSmNdIsochron,
} from "./tool.js";

describe("sm-nd-isochron", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSmNdIsochron(smNdIsochronExample.input)).toEqual({
      ok: true,
      output: smNdIsochronExample.output,
    });
  });

  it("recovers the decay-constant age for a known slope", () => {
    const result = calculateSmNdIsochron({
      smNd1: 0,
      ndRatio1: 0.51,
      smNd2: 1,
      ndRatio2: 0.51 + Math.exp(6.54e-12 * 2.5e9) - 1,
    });
    expect(result.ageMa).toBeCloseTo(2500, 6);
  });

  it("rejects a negative isochron slope", () => {
    expect(
      runSmNdIsochron({
        smNd1: 0.1,
        ndRatio1: 0.513,
        smNd2: 0.5,
        ndRatio2: 0.512,
      }).ok,
    ).toBe(false);
  });
});
