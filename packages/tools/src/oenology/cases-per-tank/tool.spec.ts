import { describe, expect, it } from "vitest";
import {
  casesPerTankExample,
  casesPerTankTool,
  runCasesPerTank,
} from "./tool.js";

describe("casesPerTankTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runCasesPerTank(casesPerTankExample.input)).toEqual({
      ok: true,
      output: casesPerTankExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(casesPerTankExample))).toEqual(casesPerTankExample);
    expect(casesPerTankTool.contractVersion).toBe(1);
    expect(casesPerTankTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runCasesPerTank(null).ok).toBe(false);
    expect(
      runCasesPerTank({ ...casesPerTankExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
