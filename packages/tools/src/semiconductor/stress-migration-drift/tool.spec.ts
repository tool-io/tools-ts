import { describe, expect, it } from "vitest";
import {
  runStressMigrationDrift,
  stressMigrationDriftExample,
} from "./tool.js";

describe("empirical stress-migration drift", () => {
  it("reproduces the documented example", () =>
    expect(runStressMigrationDrift(stressMigrationDriftExample.input)).toEqual({
      ok: true,
      output: stressMigrationDriftExample.output,
    }));
  it("returns zero without tensile stress", () =>
    expect(
      runStressMigrationDrift({
        migrationRateNmPerHourPerMPa: 0.01,
        tensileStressMpa: 0,
      }),
    ).toEqual({ ok: true, output: { voidGrowthNmPerHour: 0 } }));
  it("requires a calibrated rate coefficient", () =>
    expect(
      runStressMigrationDrift({ tensileStressMpa: 100 } as never),
    ).toMatchObject({ ok: false }));
});
