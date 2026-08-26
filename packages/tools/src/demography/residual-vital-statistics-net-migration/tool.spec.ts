import { describe, expect, it } from "vitest";
import {
  calculateResidualVitalStatisticsNetMigration,
  runResidualVitalStatisticsNetMigration,
  residualVitalStatisticsNetMigrationExample,
} from "./tool.js";

describe("demography/residual-vital-statistics-net-migration", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runResidualVitalStatisticsNetMigration(
        residualVitalStatisticsNetMigrationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: residualVitalStatisticsNetMigrationExample.output,
    });
  });

  it("reports negative residuals when natural increase exceeds growth", () => {
    expect(
      calculateResidualVitalStatisticsNetMigration({
        populationStart: 1000,
        populationEnd: 1050,
        births: 100,
        deaths: 10,
      }),
    ).toEqual({ netMigration: -40 });
  });

  it("rejects negative counts", () => {
    expect(
      runResidualVitalStatisticsNetMigration({
        populationStart: -1,
        populationEnd: 100,
        births: 0,
        deaths: 0,
      }).ok,
    ).toBe(false);
  });
});
