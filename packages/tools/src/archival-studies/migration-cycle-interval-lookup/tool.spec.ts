import { describe, expect, it } from "vitest";
import {
  calculateMigrationCycleIntervalLookup,
  migrationCycleIntervalLookupExample,
  runMigrationCycleIntervalLookup,
} from "./tool.js";

describe("archival-studies/migration-cycle-interval-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMigrationCycleIntervalLookup(
        migrationCycleIntervalLookupExample.input,
      ),
    ).toEqual({ ok: true, output: migrationCycleIntervalLookupExample.output });
  });

  it("assigns the shortest cycles to high-risk classes", () => {
    expect(
      calculateMigrationCycleIntervalLookup({ formatClass: "moving-image" })
        .intervalYears,
    ).toBe(5);
    expect(
      calculateMigrationCycleIntervalLookup({ formatClass: "text" })
        .intervalYears,
    ).toBe(10);
  });

  it("rejects unknown format classes", () => {
    expect(
      runMigrationCycleIntervalLookup({
        formatClass: "hologram" as unknown as "text",
      }).ok,
    ).toBe(false);
  });
});
