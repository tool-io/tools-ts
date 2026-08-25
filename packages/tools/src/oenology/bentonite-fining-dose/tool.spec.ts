import { describe, expect, it } from "vitest";
import {
  bentoniteFiningDoseExample,
  bentoniteFiningDoseTool,
  runBentoniteFiningDose,
} from "./tool.js";

describe("bentoniteFiningDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBentoniteFiningDose(bentoniteFiningDoseExample.input)).toEqual({
      ok: true,
      output: bentoniteFiningDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(bentoniteFiningDoseExample))).toEqual(bentoniteFiningDoseExample);
    expect(bentoniteFiningDoseTool.contractVersion).toBe(1);
    expect(bentoniteFiningDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBentoniteFiningDose(null).ok).toBe(false);
    expect(
      runBentoniteFiningDose({ ...bentoniteFiningDoseExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
