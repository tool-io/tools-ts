import { describe, expect, it } from "vitest";
import {
  conidiaRatioClassifierExample,
  conidiaRatioClassifierTool,
  runConidiaRatioClassifier,
} from "./tool.js";

describe("Micro/Macro Ratio Class", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runConidiaRatioClassifier(conidiaRatioClassifierExample.input),
    ).toEqual({
      ok: true,
      output: conidiaRatioClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(conidiaRatioClassifierExample))).toEqual(
      conidiaRatioClassifierExample,
    );
    expect(conidiaRatioClassifierTool.contractVersion).toBe(1);
    expect(conidiaRatioClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("classes larger macroconidia counts as macroconidia-dominant with a fractional ratio", () => {
    const result = runConidiaRatioClassifier({
      microConidiaInt: 2,
      macroConidiaInt: 8,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toEqual({
        dominantForm: "macroconidia-dominant",
        microMacroRatio: 0.25,
      });
  });

  it("classes equal counts as equal with a unit ratio", () => {
    const result = runConidiaRatioClassifier({
      microConidiaInt: 5,
      macroConidiaInt: 5,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toEqual({
        dominantForm: "equal",
        microMacroRatio: 1,
      });
  });

  it("rejects a zero macroconidium denominator", () => {
    const result = runConidiaRatioClassifier({
      microConidiaInt: 4,
      macroConidiaInt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("zero_denominator");
  });

  it("guards an all-zero count with no_conidia", () => {
    const result = runConidiaRatioClassifier({
      microConidiaInt: 0,
      macroConidiaInt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("no_conidia");
  });

  it("returns structured errors for malformed input", () => {
    expect(runConidiaRatioClassifier(null).ok).toBe(false);
    expect(
      runConidiaRatioClassifier({ microConidiaInt: -1, macroConidiaInt: 2 }).ok,
    ).toBe(false);
    expect(
      runConidiaRatioClassifier({ microConidiaInt: 1.5, macroConidiaInt: 2 })
        .ok,
    ).toBe(false);
  });
});
