import { describe, expect, it } from "vitest";
import {
  rsFromSugarDoseExample,
  rsFromSugarDoseTool,
  runRsFromSugarDose,
} from "./tool.js";

describe("rsFromSugarDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runRsFromSugarDose(rsFromSugarDoseExample.input)).toEqual({
      ok: true,
      output: rsFromSugarDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(rsFromSugarDoseExample))).toEqual(
      rsFromSugarDoseExample,
    );
    expect(rsFromSugarDoseTool.contractVersion).toBe(1);
    expect(rsFromSugarDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runRsFromSugarDose(null).ok).toBe(false);
    expect(
      runRsFromSugarDose({
        ...rsFromSugarDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
