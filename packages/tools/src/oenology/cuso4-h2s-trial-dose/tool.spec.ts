import { describe, expect, it } from "vitest";
import {
  cuso4H2sTrialDoseExample,
  cuso4H2sTrialDoseTool,
  runCuso4H2sTrialDose,
} from "./tool.js";

describe("cuso4H2sTrialDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCuso4H2sTrialDose(cuso4H2sTrialDoseExample.input)).toEqual({
      ok: true,
      output: cuso4H2sTrialDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(cuso4H2sTrialDoseExample))).toEqual(
      cuso4H2sTrialDoseExample,
    );
    expect(cuso4H2sTrialDoseTool.contractVersion).toBe(1);
    expect(cuso4H2sTrialDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCuso4H2sTrialDose(null).ok).toBe(false);
    expect(
      runCuso4H2sTrialDose({
        ...cuso4H2sTrialDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
