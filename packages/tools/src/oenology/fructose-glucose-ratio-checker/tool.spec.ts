import { describe, expect, it } from "vitest";
import {
  fructoseGlucoseRatioCheckerExample,
  fructoseGlucoseRatioCheckerTool,
  runFructoseGlucoseRatioChecker,
} from "./tool.js";

describe("fructoseGlucoseRatioCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runFructoseGlucoseRatioChecker(fructoseGlucoseRatioCheckerExample.input),
    ).toEqual({
      ok: true,
      output: fructoseGlucoseRatioCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(fructoseGlucoseRatioCheckerExample)),
    ).toEqual(fructoseGlucoseRatioCheckerExample);
    expect(fructoseGlucoseRatioCheckerTool.contractVersion).toBe(1);
    expect(fructoseGlucoseRatioCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runFructoseGlucoseRatioChecker(null).ok).toBe(false);
    expect(
      runFructoseGlucoseRatioChecker({
        ...fructoseGlucoseRatioCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});

describe("fructose glucose ratio boundaries", () => {
  it("escalates from watch to fructose dominant", () => {
    const thresholds = { fructoseDominantRatio: 2, watchRatio: 1.2 };
    const watch = runFructoseGlucoseRatioChecker({
      ...thresholds,
      fructoseGPerL: 7,
      glucoseGPerL: 5,
    });
    const dominant = runFructoseGlucoseRatioChecker({
      ...thresholds,
      fructoseGPerL: 12,
      glucoseGPerL: 5,
    });
    expect(watch.ok).toBe(true);
    if (watch.ok) expect(watch.output.status).toBe("watch");
    expect(dominant.ok).toBe(true);
    if (dominant.ok) expect(dominant.output.status).toBe("fructose_dominant");
  });

  it("rejects zero glucose", () => {
    expect(
      runFructoseGlucoseRatioChecker({
        fructoseDominantRatio: 2,
        fructoseGPerL: 5,
        glucoseGPerL: 0,
        watchRatio: 1.2,
      }).ok,
    ).toBe(false);
  });
});
