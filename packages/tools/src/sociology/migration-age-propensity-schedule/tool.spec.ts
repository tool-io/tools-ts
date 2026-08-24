import { describe, expect, it } from "vitest";
import {
  calculateMigrationAgePropensities,
  migrationAgePropensityScheduleExample,
  migrationAgePropensityScheduleTool,
  runMigrationAgePropensitySchedule,
} from "./tool.js";

describe("migrationAgePropensityScheduleTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runMigrationAgePropensitySchedule(
        migrationAgePropensityScheduleExample.input,
      ),
    ).toEqual({
      ok: true,
      output: migrationAgePropensityScheduleExample.output,
    });
  });

  it("divides each migrant count by its aligned population base", () => {
    expect(
      calculateMigrationAgePropensities({
        migrantsByAge: [5, 30],
        populationByAge: [100, 200],
      }),
    ).toEqual({ propensitiesByAge: [0.05, 0.15] });
    const result = runMigrationAgePropensitySchedule({
      migrantsByAge: [5],
      populationByAge: [100, 200],
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].code).toBe("length_mismatch");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(migrationAgePropensityScheduleExample)),
    ).toEqual(migrationAgePropensityScheduleExample);
    expect(migrationAgePropensityScheduleTool.contractVersion).toBe(1);
    expect(migrationAgePropensityScheduleTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMigrationAgePropensitySchedule(null).ok).toBe(false);
    expect(
      runMigrationAgePropensitySchedule({
        ...migrationAgePropensityScheduleExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
