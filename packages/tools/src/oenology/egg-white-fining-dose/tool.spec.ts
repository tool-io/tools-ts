import { describe, expect, it } from "vitest";
import {
  eggWhiteFiningDoseExample,
  eggWhiteFiningDoseTool,
  runEggWhiteFiningDose,
} from "./tool.js";

describe("eggWhiteFiningDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runEggWhiteFiningDose(eggWhiteFiningDoseExample.input)).toEqual({
      ok: true,
      output: eggWhiteFiningDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(eggWhiteFiningDoseExample))).toEqual(
      eggWhiteFiningDoseExample,
    );
    expect(eggWhiteFiningDoseTool.contractVersion).toBe(1);
    expect(eggWhiteFiningDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runEggWhiteFiningDose(null).ok).toBe(false);
    expect(
      runEggWhiteFiningDose({
        ...eggWhiteFiningDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("reports exact and whole-egg quantities separately", () => {
    expect(
      runEggWhiteFiningDose({
        barrelVolumeLiters: 225,
        volumeLiters: 100,
        whitesPerBarrel: 4,
      }),
    ).toEqual({
      ok: true,
      output: { eggWhiteCount: 2, eggWhiteEquivalent: 1.77777777778 },
    });
  });
});
