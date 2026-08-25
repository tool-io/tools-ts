import { describe, expect, it } from "vitest";
import {
  diacetylThresholdCheckerExample,
  diacetylThresholdCheckerTool,
  runDiacetylThresholdChecker,
} from "./tool.js";

describe("diacetylThresholdCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runDiacetylThresholdChecker(diacetylThresholdCheckerExample.input),
    ).toEqual({
      ok: true,
      output: diacetylThresholdCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(diacetylThresholdCheckerExample))).toEqual(
      diacetylThresholdCheckerExample,
    );
    expect(diacetylThresholdCheckerTool.contractVersion).toBe(1);
    expect(diacetylThresholdCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDiacetylThresholdChecker(null).ok).toBe(false);
    expect(
      runDiacetylThresholdChecker({
        ...diacetylThresholdCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
