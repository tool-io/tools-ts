import { describe, expect, it } from "vitest";
import {
  calculateRlTimeConstant,
  rlTimeConstantExample,
  runRlTimeConstant,
} from "./tool.js";

describe("rl time constant calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRlTimeConstant(rlTimeConstantExample.input)).toEqual({
      ok: true,
      output: rlTimeConstantExample.output,
    });
  });

  it("doubles when inductance doubles", () => {
    expect(
      calculateRlTimeConstant({ inductanceH: 0.1, resistanceOhms: 100 })
        .timeConstantS,
    ).toBe(
      calculateRlTimeConstant({ inductanceH: 0.05, resistanceOhms: 50 })
        .timeConstantS,
    );
    expect(
      calculateRlTimeConstant({ inductanceH: 0.02, resistanceOhms: 10 })
        .timeConstantS,
    ).toBe(0.002);
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { inductanceH: 0, resistanceOhms: 100 },
      { inductanceH: 0.05, resistanceOhms: -100 },
    ])
      expect(runRlTimeConstant(bad).ok).toBe(false);
  });
});
