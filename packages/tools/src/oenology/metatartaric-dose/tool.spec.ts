import { describe, expect, it } from "vitest";
import {
  metatartaricDoseExample,
  metatartaricDoseTool,
  runMetatartaricDose,
} from "./tool.js";

describe("metatartaricDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMetatartaricDose(metatartaricDoseExample.input)).toEqual({
      ok: true,
      output: metatartaricDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(metatartaricDoseExample))).toEqual(
      metatartaricDoseExample,
    );
    expect(metatartaricDoseTool.contractVersion).toBe(1);
    expect(metatartaricDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMetatartaricDose(null).ok).toBe(false);
    expect(
      runMetatartaricDose({
        ...metatartaricDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
