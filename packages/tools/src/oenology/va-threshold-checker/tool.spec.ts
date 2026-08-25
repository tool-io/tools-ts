import { describe, expect, it } from "vitest";
import {
  vaThresholdCheckerExample,
  vaThresholdCheckerTool,
  runVaThresholdChecker,
} from "./tool.js";

describe("vaThresholdCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runVaThresholdChecker(vaThresholdCheckerExample.input)).toEqual({
      ok: true,
      output: vaThresholdCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(vaThresholdCheckerExample))).toEqual(
      vaThresholdCheckerExample,
    );
    expect(vaThresholdCheckerTool.contractVersion).toBe(1);
    expect(vaThresholdCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runVaThresholdChecker(null).ok).toBe(false);
    expect(
      runVaThresholdChecker({
        ...vaThresholdCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
