import { describe, expect, it } from "vitest";
import { khco3DoseExample, khco3DoseTool, runKhco3Dose } from "./tool.js";

describe("khco3DoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runKhco3Dose(khco3DoseExample.input)).toEqual({
      ok: true,
      output: khco3DoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(khco3DoseExample))).toEqual(
      khco3DoseExample,
    );
    expect(khco3DoseTool.contractVersion).toBe(1);
    expect(khco3DoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runKhco3Dose(null).ok).toBe(false);
    expect(
      runKhco3Dose({ ...khco3DoseExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
