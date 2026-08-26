import { describe, expect, it } from "vitest";
import {
  calculateUnderdotUncertainValidator,
  underdotUncertainValidatorExample,
  runUnderdotUncertainValidator,
} from "./tool.js";

describe("epigraphy/underdot-uncertain-validator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runUnderdotUncertainValidator(underdotUncertainValidatorExample.input),
    ).toEqual({ ok: true, output: underdotUncertainValidatorExample.output });
  });

  it("counts several dotted letters", () => {
    expect(
      calculateUnderdotUncertainValidator({
        text: "l\u0323egitu\u0323r",
      }).uncertainLetterCount,
    ).toBe(2);
  });

  it("rejects orphaned and doubled underdots", () => {
    expect(
      calculateUnderdotUncertainValidator({ text: "a\u0323\u0323" }),
    ).toEqual({ uncertainLetterCount: 1, malformedMarks: 1, isValid: false });
    expect(
      calculateUnderdotUncertainValidator({ text: "\u0323x" }).malformedMarks,
    ).toBe(1);
  });

  it("rejects empty input", () => {
    expect(runUnderdotUncertainValidator({ text: "" }).ok).toBe(false);
  });
});
