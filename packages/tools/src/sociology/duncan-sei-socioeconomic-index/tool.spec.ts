import { describe, expect, it } from "vitest";
import {
  calculateDuncanSei,
  duncanSeiSocioeconomicIndexExample,
  duncanSeiSocioeconomicIndexTool,
  runDuncanSeiSocioeconomicIndex,
} from "./tool.js";

describe("duncanSeiSocioeconomicIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runDuncanSeiSocioeconomicIndex(duncanSeiSocioeconomicIndexExample.input),
    ).toEqual({
      ok: true,
      output: duncanSeiSocioeconomicIndexExample.output,
    });
  });

  it("applies Duncan's historical regression rather than an unweighted mean", () => {
    expect(
      calculateDuncanSei({
        highIncomePercent: 50,
        highSchoolGraduatePercent: 50,
      }),
    ).toEqual({ socioeconomicIndex: 51 });
    const result = runDuncanSeiSocioeconomicIndex({
      highIncomePercent: 0,
      highSchoolGraduatePercent: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].code).toBe("outside_model_range");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(duncanSeiSocioeconomicIndexExample)),
    ).toEqual(duncanSeiSocioeconomicIndexExample);
    expect(duncanSeiSocioeconomicIndexTool.contractVersion).toBe(1);
    expect(duncanSeiSocioeconomicIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runDuncanSeiSocioeconomicIndex(null).ok).toBe(false);
    expect(
      runDuncanSeiSocioeconomicIndex({
        ...duncanSeiSocioeconomicIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
