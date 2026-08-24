import { describe, expect, it } from "vitest";
import {
  calculateSchutzIndex,
  schutzIndexExample,
  schutzIndexTool,
  runSchutzIndex,
} from "./tool.js";

describe("schutzIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runSchutzIndex(schutzIndexExample.input)).toEqual({
      ok: true,
      output: schutzIndexExample.output,
    });
  });

  it("is zero under equality and rejects an empty distribution", () => {
    expect(calculateSchutzIndex({ incomes: [4, 4, 4] })).toEqual({
      schutzIndex: 0,
    });
    const result = runSchutzIndex({ incomes: [] });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("incomes");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(schutzIndexExample))).toEqual(
      schutzIndexExample,
    );
    expect(schutzIndexTool.contractVersion).toBe(1);
    expect(schutzIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSchutzIndex(null).ok).toBe(false);
    expect(
      runSchutzIndex({ ...schutzIndexExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
