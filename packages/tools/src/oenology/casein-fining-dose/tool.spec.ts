import { describe, expect, it } from "vitest";
import {
  caseinFiningDoseExample,
  caseinFiningDoseTool,
  runCaseinFiningDose,
} from "./tool.js";

describe("caseinFiningDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCaseinFiningDose(caseinFiningDoseExample.input)).toEqual({
      ok: true,
      output: caseinFiningDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(caseinFiningDoseExample))).toEqual(caseinFiningDoseExample);
    expect(caseinFiningDoseTool.contractVersion).toBe(1);
    expect(caseinFiningDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCaseinFiningDose(null).ok).toBe(false);
    expect(
      runCaseinFiningDose({ ...caseinFiningDoseExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
