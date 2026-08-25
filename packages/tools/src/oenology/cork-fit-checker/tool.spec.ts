import { describe, expect, it } from "vitest";
import {
  corkFitCheckerExample,
  corkFitCheckerTool,
  runCorkFitChecker,
} from "./tool.js";

describe("corkFitCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCorkFitChecker(corkFitCheckerExample.input)).toEqual({
      ok: true,
      output: corkFitCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(corkFitCheckerExample))).toEqual(
      corkFitCheckerExample,
    );
    expect(corkFitCheckerTool.contractVersion).toBe(1);
    expect(corkFitCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCorkFitChecker(null).ok).toBe(false);
    expect(
      runCorkFitChecker({ ...corkFitCheckerExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });

  it("uses closure-specific compression limits", () => {
    expect(
      runCorkFitChecker({
        boreDiameterMm: 18.5,
        corkDiameterMm: 22,
        maximumCompressionPercent: 15,
        minimumCompressionPercent: 10,
      }),
    ).toEqual({
      ok: true,
      output: { compressionPercent: 15.9090909091, fitsBore: false },
    });
  });
});
