import { describe, expect, it } from "vitest";
import {
  oversizePackageThresholdCheckerExample,
  runOversizePackageThresholdChecker,
} from "./tool.js";

describe("oversize-package-threshold-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOversizePackageThresholdChecker(
        oversizePackageThresholdCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: oversizePackageThresholdCheckerExample.output,
    });
  });

  it("passes an ordinary carton through both limits", () => {
    const result = runOversizePackageThresholdChecker({
      lengthIn: 24,
      widthIn: 18,
      heightIn: 12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.isOversizePackage).toBe(false);
  });

  it("finds the longest side regardless of field order", () => {
    const result = runOversizePackageThresholdChecker({
      heightIn: 20,
      lengthIn: 10,
      maximumLengthIn: 15,
      maximumLengthPlusGirthIn: 200,
      widthIn: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.exceedsLengthLimit).toBe(true);
    expect(result.output.girthIn).toBe(30);
  });

  it("rejects non-positive dimensions", () => {
    expect(
      runOversizePackageThresholdChecker({
        lengthIn: 10,
        widthIn: 0,
        heightIn: 5,
      }).ok,
    ).toBe(false);
  });
});
