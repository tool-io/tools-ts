import { describe, expect, it } from "vitest";
import {
  marginSymmetryDeviationRaterExample,
  runMarginSymmetryDeviationRater,
} from "./tool.js";

describe("margin-symmetry-deviation-rater", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMarginSymmetryDeviationRater(
        marginSymmetryDeviationRaterExample.input,
      ),
    ).toEqual({
      ok: true,
      output: marginSymmetryDeviationRaterExample.output,
    });
  });

  it("reports zero deviation for symmetric margins", () => {
    const result = runMarginSymmetryDeviationRater({
      leftMarginCm: 1,
      rightMarginCm: 1,
      topMarginCm: 2,
      bottomMarginCm: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.maxDeviationCm as number).toBe(0);
  });

  it("rejects a negative margin", () => {
    expect(
      runMarginSymmetryDeviationRater({
        leftMarginCm: -1,
        rightMarginCm: 1,
        topMarginCm: 2,
        bottomMarginCm: 2,
      }).ok,
    ).toBe(false);
  });
});
