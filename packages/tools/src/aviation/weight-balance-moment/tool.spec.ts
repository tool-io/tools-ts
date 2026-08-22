import { describe, expect, it } from "vitest";
import { runWeightBalanceMoment } from "./tool.js";

describe("weight balance moment calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWeightBalanceMoment({ armInches: 40, weightLb: 200 })).toEqual({
      ok: true,
      output: { momentLbIn: 8000 },
    });
  });

  it("supports negative arms forward of the datum", () => {
    expect(runWeightBalanceMoment({ armInches: -30, weightLb: 100 })).toEqual({
      ok: true,
      output: { momentLbIn: -3000 },
    });
  });

  it("rejects non-positive weights through execution", () => {
    expect(runWeightBalanceMoment({ armInches: 40, weightLb: 0 }).ok).toBe(
      false,
    );
  });
});
