import { describe, expect, it } from "vitest";
import {
  isinglassFiningDoseExample,
  isinglassFiningDoseTool,
  runIsinglassFiningDose,
} from "./tool.js";

describe("isinglassFiningDoseTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runIsinglassFiningDose(isinglassFiningDoseExample.input)).toEqual({
      ok: true,
      output: isinglassFiningDoseExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(isinglassFiningDoseExample))).toEqual(
      isinglassFiningDoseExample,
    );
    expect(isinglassFiningDoseTool.contractVersion).toBe(1);
    expect(isinglassFiningDoseTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runIsinglassFiningDose(null).ok).toBe(false);
    expect(
      runIsinglassFiningDose({
        ...isinglassFiningDoseExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
