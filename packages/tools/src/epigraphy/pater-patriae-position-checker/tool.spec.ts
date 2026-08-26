import { describe, expect, it } from "vitest";
import {
  calculatePaterPatriaePositionChecker,
  paterPatriaePositionCheckerExample,
  runPaterPatriaePositionChecker,
} from "./tool.js";

describe("epigraphy/pater-patriae-position-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPaterPatriaePositionChecker(paterPatriaePositionCheckerExample.input),
    ).toEqual({ ok: true, output: paterPatriaePositionCheckerExample.output });
  });

  it("matches abbreviated forms with interpuncts", () => {
    const result = calculatePaterPatriaePositionChecker({
      text: "IMP CAESAR DIVI F AVGVSTVS P·PATRIAE",
    });
    expect(result.present).toBe(true);
    expect(result.firstOccurrenceTokenIndex).toBe(5);
    expect(result.isLastToken).toBe(true);
  });

  it("reports absence cleanly", () => {
    expect(
      calculatePaterPatriaePositionChecker({ text: "DIS MANIBVS SACRVM" }),
    ).toEqual({
      present: false,
      occurrenceCount: 0,
      firstOccurrenceTokenIndex: 0,
      isFirstToken: false,
      isLastToken: false,
    });
  });

  it("rejects empty input", () => {
    expect(runPaterPatriaePositionChecker({ text: "" }).ok).toBe(false);
  });
});
