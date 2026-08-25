import { describe, expect, it } from "vitest";
import {
  caco3DoseExample,
  caco3DoseTool,
  runCaco3Dose,
} from "./tool.js";

describe("caco3DoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCaco3Dose(caco3DoseExample.input)).toEqual({
      ok: true,
      output: caco3DoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(caco3DoseExample))).toEqual(caco3DoseExample);
    expect(caco3DoseTool.contractVersion).toBe(1);
    expect(caco3DoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCaco3Dose(null).ok).toBe(false);
    expect(
      runCaco3Dose({ ...caco3DoseExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
