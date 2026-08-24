import { describe, expect, it } from "vitest";
import {
  calculateMigrationEffectiveness,
  migrationEffectivenessIndexExample,
  migrationEffectivenessIndexTool,
  runMigrationEffectivenessIndex,
} from "./tool.js";

describe("migrationEffectivenessIndexTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runMigrationEffectivenessIndex(migrationEffectivenessIndexExample.input),
    ).toEqual({
      ok: true,
      output: migrationEffectivenessIndexExample.output,
    });
  });

  it("is zero for balanced exchange and one for a one-way stream", () => {
    expect(calculateMigrationEffectiveness({ inflow: 5, outflow: 5 })).toEqual({
      effectivenessIndex: 0,
    });
    expect(calculateMigrationEffectiveness({ inflow: 5, outflow: 0 })).toEqual({
      effectivenessIndex: 1,
    });
    const result = runMigrationEffectivenessIndex({ inflow: 0, outflow: 0 });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("inflow");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(migrationEffectivenessIndexExample)),
    ).toEqual(migrationEffectivenessIndexExample);
    expect(migrationEffectivenessIndexTool.contractVersion).toBe(1);
    expect(migrationEffectivenessIndexTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMigrationEffectivenessIndex(null).ok).toBe(false);
    expect(
      runMigrationEffectivenessIndex({
        ...migrationEffectivenessIndexExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
