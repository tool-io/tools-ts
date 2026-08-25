import { describe, expect, it } from "vitest";
import {
  standardDrinkUnitsExample,
  standardDrinkUnitsTool,
  runStandardDrinkUnits,
} from "./tool.js";

describe("standardDrinkUnitsTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runStandardDrinkUnits(standardDrinkUnitsExample.input)).toEqual({
      ok: true,
      output: standardDrinkUnitsExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(standardDrinkUnitsExample))).toEqual(
      standardDrinkUnitsExample,
    );
    expect(standardDrinkUnitsTool.contractVersion).toBe(1);
    expect(standardDrinkUnitsTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runStandardDrinkUnits(null).ok).toBe(false);
    expect(
      runStandardDrinkUnits({
        ...standardDrinkUnitsExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
