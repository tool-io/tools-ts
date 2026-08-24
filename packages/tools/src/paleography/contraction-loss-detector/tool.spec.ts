import { describe, expect, it } from "vitest";
import {
  contractionLossDetectorExample,
  runContractionLossDetector,
} from "./tool.js";

describe("contraction-loss-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runContractionLossDetector(contractionLossDetectorExample.input),
    ).toEqual({ ok: true, output: contractionLossDetectorExample.output });
  });

  it("reports expansion when the copy adds forms", () => {
    const result = runContractionLossDetector({
      exemplarAbbreviatedForms: 10,
      copyAbbreviatedForms: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.lossRating as string).toBe("expansion");
    expect(result.output.addedForms as number).toBe(2);
  });

  it("rejects an empty exemplar count", () => {
    expect(
      runContractionLossDetector({
        exemplarAbbreviatedForms: 0,
        copyAbbreviatedForms: 0,
      }).ok,
    ).toBe(false);
  });
});
