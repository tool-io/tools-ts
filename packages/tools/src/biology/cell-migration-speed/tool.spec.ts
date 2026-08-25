import { describe, expect, it } from "vitest";
import { cellMigrationSpeedExample, runCellMigrationSpeed } from "./tool.js";

describe("Migration Speed", () => {
  it("publishes an executable example", () =>
    expect(runCellMigrationSpeed(cellMigrationSpeedExample.input)).toEqual({
      ok: true,
      output: cellMigrationSpeedExample.output,
    }));
  it("divides distance by hours elapsed", () =>
    expect(
      runCellMigrationSpeed({ distanceUm: 112.5, hoursElapsed: 18 }),
    ).toEqual({ ok: true, output: { migrationSpeedUmPerHour: 6.25 } }));
  it("yields zero speed for zero distance", () =>
    expect(runCellMigrationSpeed({ distanceUm: 0, hoursElapsed: 7 })).toEqual({
      ok: true,
      output: { migrationSpeedUmPerHour: 0 },
    }));
  it("accepts fractional hours", () =>
    expect(
      runCellMigrationSpeed({ distanceUm: 30, hoursElapsed: 0.5 }),
    ).toEqual({ ok: true, output: { migrationSpeedUmPerHour: 60 } }));
  it("rejects zero hours elapsed", () => {
    const result = runCellMigrationSpeed({ distanceUm: 40, hoursElapsed: 0 });
    expect(result.ok).toBe(false);
  });
  it("rejects negative hours elapsed", () => {
    const result = runCellMigrationSpeed({ distanceUm: 40, hoursElapsed: -1 });
    expect(result.ok).toBe(false);
  });
  it("rejects negative distances", () =>
    expect(runCellMigrationSpeed({ distanceUm: -5, hoursElapsed: 2 }).ok).toBe(
      false,
    ));
  it("rejects missing inputs", () =>
    expect(runCellMigrationSpeed({ distanceUm: 40 }).ok).toBe(false));
});
