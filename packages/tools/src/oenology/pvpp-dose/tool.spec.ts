import { describe, expect, it } from "vitest";
import { pvppDoseExample, pvppDoseTool, runPvppDose } from "./tool.js";

describe("pvppDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runPvppDose(pvppDoseExample.input)).toEqual({
      ok: true,
      output: pvppDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(pvppDoseExample))).toEqual(
      pvppDoseExample,
    );
    expect(pvppDoseTool.contractVersion).toBe(1);
    expect(pvppDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPvppDose(null).ok).toBe(false);
    expect(
      runPvppDose({ ...pvppDoseExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
