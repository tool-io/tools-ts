import { describe, expect, it } from "vitest";
import {
  columnSupportRatioClassifierExample,
  runColumnSupportRatioClassifier,
} from "./tool.js";

describe("column-support-ratio-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runColumnSupportRatioClassifier(
        columnSupportRatioClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: columnSupportRatioClassifierExample.output,
    });
  });

  it("matches the Doric canon for an eight-diameter column by default", () => {
    const result = runColumnSupportRatioClassifier({
      diameterCm: 25,
      heightCm: 200,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.slendernessRatio as number).toBe(8);
    expect(result.output.deviationDiameters as number).toBe(0);
  });

  it("rejects a zero diameter", () => {
    expect(
      runColumnSupportRatioClassifier({ diameterCm: 0, heightCm: 200 }).ok,
    ).toBe(false);
  });
});
