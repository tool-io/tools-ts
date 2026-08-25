import { describe, expect, it } from "vitest";
import { runSlimeMoldMigrationSpeedRater } from "./tool.js";
describe("Slime Mold Speed", () => {
  it("calculates a valid result", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 8,
        migrationDistanceMm: 40,
      }),
    ).toEqual({ ok: true, output: { migrationSpeedMmPerHour: 5 } }));
  it("rates zero for stationary plasmodia", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 6,
        migrationDistanceMm: 0,
      }),
    ).toEqual({ ok: true, output: { migrationSpeedMmPerHour: 0 } }));
  it("supports single hour observations", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 1,
        migrationDistanceMm: 12,
      }),
    ).toEqual({ ok: true, output: { migrationSpeedMmPerHour: 12 } }));
  it("produces fractional speeds", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 4,
        migrationDistanceMm: 10,
      }),
    ).toEqual({ ok: true, output: { migrationSpeedMmPerHour: 2.5 } }));
  it("averages over long runs", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 50,
        migrationDistanceMm: 100,
      }),
    ).toEqual({ ok: true, output: { migrationSpeedMmPerHour: 2 } }));
  it("rejects zero elapsed hours", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 0,
        migrationDistanceMm: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative distances", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 2,
        migrationDistanceMm: -3,
      }).ok,
    ).toBe(false));
  it("rejects fractional elapsed hours", () =>
    expect(
      runSlimeMoldMigrationSpeedRater({
        hoursElapsedInt: 2.5,
        migrationDistanceMm: 10,
      }).ok,
    ).toBe(false));
});
