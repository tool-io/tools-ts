import { describe, expect, it } from "vitest";
import { migrationRateExample, runMigrationRate } from "./tool.js";

describe("Migration Rate m", () => {
  it("publishes an executable example", () =>
    expect(runMigrationRate(migrationRateExample.input)).toEqual({
      ok: true,
      output: migrationRateExample.output,
    }));
  it("divides migrants per generation by Ne", () =>
    expect(
      runMigrationRate({
        effectivePopulationSizeInt: 125,
        migrantsPerGeneration: 25,
      }),
    ).toEqual({ ok: true, output: { migrationRateM: 0.2 } }));
  it("handles large populations", () =>
    expect(
      runMigrationRate({
        effectivePopulationSizeInt: 2000,
        migrantsPerGeneration: 40,
      }),
    ).toEqual({ ok: true, output: { migrationRateM: 0.02 } }));
  it("yields zero with no migrants", () =>
    expect(
      runMigrationRate({
        effectivePopulationSizeInt: 500,
        migrantsPerGeneration: 0,
      }),
    ).toEqual({ ok: true, output: { migrationRateM: 0 } }));
  it("rejects zero Ne", () =>
    expect(
      runMigrationRate({
        effectivePopulationSizeInt: 0,
        migrantsPerGeneration: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative migrants", () =>
    expect(
      runMigrationRate({
        effectivePopulationSizeInt: 500,
        migrantsPerGeneration: -5,
      }).ok,
    ).toBe(false));
  it("rejects non-integer Ne", () =>
    expect(
      runMigrationRate({
        effectivePopulationSizeInt: 500.5,
        migrantsPerGeneration: 10,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runMigrationRate({ migrantsPerGeneration: 10 }).ok).toBe(false));
});
