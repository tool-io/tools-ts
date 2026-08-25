import { describe, expect, it } from "vitest";
import {
  taTitrationGplExample,
  taTitrationGplTool,
  runTaTitrationGpl,
} from "./tool.js";

describe("taTitrationGplTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runTaTitrationGpl(taTitrationGplExample.input)).toEqual({
      ok: true,
      output: taTitrationGplExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(taTitrationGplExample))).toEqual(
      taTitrationGplExample,
    );
    expect(taTitrationGplTool.contractVersion).toBe(1);
    expect(taTitrationGplTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTaTitrationGpl(null).ok).toBe(false);
    expect(
      runTaTitrationGpl({ ...taTitrationGplExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});

describe("ta titration gpl scaling", () => {
  it("doubles with normality", () => {
    const weak = runTaTitrationGpl({
      naohMl: 5,
      naohNormality: 0.05,
      sampleMl: 10,
    });
    expect(weak.ok && weak.output.taGPerL).toBeCloseTo(1.875, 9);
  });

  it("rejects empty samples", () => {
    expect(
      runTaTitrationGpl({ naohMl: 5, naohNormality: 0.1, sampleMl: 0 }).ok,
    ).toBe(false);
  });
});
