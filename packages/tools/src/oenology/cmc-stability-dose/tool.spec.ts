import { describe, expect, it } from "vitest";
import {
  cmcStabilityDoseExample,
  cmcStabilityDoseTool,
  runCmcStabilityDose,
} from "./tool.js";

describe("cmcStabilityDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCmcStabilityDose(cmcStabilityDoseExample.input)).toEqual({
      ok: true,
      output: cmcStabilityDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(cmcStabilityDoseExample))).toEqual(
      cmcStabilityDoseExample,
    );
    expect(cmcStabilityDoseTool.contractVersion).toBe(1);
    expect(cmcStabilityDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCmcStabilityDose(null).ok).toBe(false);
    expect(
      runCmcStabilityDose({
        ...cmcStabilityDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
