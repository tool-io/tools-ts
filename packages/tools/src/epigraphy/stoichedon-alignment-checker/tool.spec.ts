import { describe, expect, it } from "vitest";
import {
  calculateStoichedonAlignmentChecker,
  runStoichedonAlignmentChecker,
  stoichedonAlignmentCheckerExample,
} from "./tool.js";

describe("epigraphy/stoichedon-alignment-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStoichedonAlignmentChecker(stoichedonAlignmentCheckerExample.input),
    ).toEqual({ ok: true, output: stoichedonAlignmentCheckerExample.output });
  });

  it("flags irregular pitch beyond the tolerance", () => {
    const result = calculateStoichedonAlignmentChecker({
      linePitchesMm: [10, 13],
    });
    expect(result.meanPitchMm).toBe(11.5);
    expect(result.spreadMm).toBe(3);
    expect(result.isStoichedon).toBe(false);
  });

  it("honors custom tolerances", () => {
    expect(
      calculateStoichedonAlignmentChecker({
        linePitchesMm: [10, 10.5],
        toleranceMm: 0.5,
      }).isStoichedon,
    ).toBe(true);
  });

  it("rejects single-line input and negative tolerances", () => {
    expect(runStoichedonAlignmentChecker({ linePitchesMm: [10] }).ok).toBe(
      false,
    );
    expect(
      runStoichedonAlignmentChecker({
        linePitchesMm: [10, 11],
        toleranceMm: -1,
      }).ok,
    ).toBe(false);
  });
});
