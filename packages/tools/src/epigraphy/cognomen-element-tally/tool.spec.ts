import { describe, expect, it } from "vitest";
import {
  calculateCognomenElementTally,
  cognomenElementTallyExample,
  runCognomenElementTally,
} from "./tool.js";

describe("epigraphy/cognomen-element-tally", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCognomenElementTally(cognomenElementTallyExample.input)).toEqual({
      ok: true,
      output: cognomenElementTallyExample.output,
    });
  });

  it("collapses extra whitespace before tallying", () => {
    expect(
      calculateCognomenElementTally({ name: "  M.   Tullius  M. f. Cicero " }),
    ).toEqual({ elements: 5, likelyCognomina: 3 });
  });

  it("floors likely cognomina at zero for short names", () => {
    expect(calculateCognomenElementTally({ name: "Cicero" })).toEqual({
      elements: 1,
      likelyCognomina: 0,
    });
  });

  it("rejects a blank name", () => {
    expect(runCognomenElementTally({ name: "" }).ok).toBe(false);
  });
});
