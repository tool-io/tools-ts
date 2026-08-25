import { describe, expect, it } from "vitest";
import {
  ascorbicComplementDoseExample,
  ascorbicComplementDoseTool,
  runAscorbicComplementDose,
} from "./tool.js";

describe("ascorbicComplementDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runAscorbicComplementDose(ascorbicComplementDoseExample.input),
    ).toEqual({
      ok: true,
      output: ascorbicComplementDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(ascorbicComplementDoseExample))).toEqual(
      ascorbicComplementDoseExample,
    );
    expect(ascorbicComplementDoseTool.contractVersion).toBe(1);
    expect(ascorbicComplementDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runAscorbicComplementDose(null).ok).toBe(false);
    expect(
      runAscorbicComplementDose({
        ...ascorbicComplementDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("does not impose an unsupported universal treatment ceiling", () => {
    expect(
      runAscorbicComplementDose({ doseRateMgPerL: 60, volumeLiters: 100 }),
    ).toEqual({ ok: true, output: { ascorbicAcidGrams: 6 } });
  });
});
