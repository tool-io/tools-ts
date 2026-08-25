import { describe, expect, it } from "vitest";
import {
  freeSo2TargetDoseExample,
  freeSo2TargetDoseTool,
  runFreeSo2TargetDose,
} from "./tool.js";

describe("freeSo2TargetDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runFreeSo2TargetDose(freeSo2TargetDoseExample.input)).toEqual({
      ok: true,
      output: freeSo2TargetDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(freeSo2TargetDoseExample))).toEqual(
      freeSo2TargetDoseExample,
    );
    expect(freeSo2TargetDoseTool.contractVersion).toBe(1);
    expect(freeSo2TargetDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runFreeSo2TargetDose(null).ok).toBe(false);
    expect(
      runFreeSo2TargetDose({
        ...freeSo2TargetDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
