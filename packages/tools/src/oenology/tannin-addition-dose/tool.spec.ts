import { describe, expect, it } from "vitest";
import {
  tanninAdditionDoseExample,
  tanninAdditionDoseTool,
  runTanninAdditionDose,
} from "./tool.js";

describe("tanninAdditionDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runTanninAdditionDose(tanninAdditionDoseExample.input)).toEqual({
      ok: true,
      output: tanninAdditionDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(tanninAdditionDoseExample))).toEqual(
      tanninAdditionDoseExample,
    );
    expect(tanninAdditionDoseTool.contractVersion).toBe(1);
    expect(tanninAdditionDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTanninAdditionDose(null).ok).toBe(false);
    expect(
      runTanninAdditionDose({
        ...tanninAdditionDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
