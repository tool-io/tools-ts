import { describe, expect, it } from "vitest";
import {
  molecularSo2Example,
  molecularSo2Tool,
  runMolecularSo2,
} from "./tool.js";

describe("molecularSo2Tool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMolecularSo2(molecularSo2Example.input)).toEqual({
      ok: true,
      output: molecularSo2Example.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(molecularSo2Example))).toEqual(
      molecularSo2Example,
    );
    expect(molecularSo2Tool.contractVersion).toBe(1);
    expect(molecularSo2Tool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMolecularSo2(null).ok).toBe(false);
    expect(
      runMolecularSo2({ ...molecularSo2Example.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
