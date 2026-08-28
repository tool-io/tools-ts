import { describe, expect, it } from "vitest";
import {
  calculateSolarFillFactor,
  runSolarFillFactor,
  solarFillFactorExample,
} from "./tool.js";

describe("Solar Fill Factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSolarFillFactor(solarFillFactorExample.input)).toEqual({
      ok: true,
      output: solarFillFactorExample.output,
    });
  });

  it("reaches one at the ideal power limit of voc times isc", () => {
    expect(
      runSolarFillFactor({
        iscAmps: 3,
        maxPowerWatts: 6,
        vocVolts: 2,
      }),
    ).toEqual({ ok: true, output: { fillFactor: 1 } });
  });

  it("stays below one for realistic cells", () => {
    const ff = calculateSolarFillFactor({
      iscAmps: 8,
      maxPowerWatts: 17.3,
      vocVolts: 21.4,
    }).fillFactor;
    expect(ff).toBeGreaterThan(0);
    expect(ff).toBeLessThan(1);
  });

  it("rises with maximum power at fixed voc and isc", () => {
    const low = calculateSolarFillFactor({
      iscAmps: 5,
      maxPowerWatts: 4,
      vocVolts: 1.5,
    }).fillFactor;
    const high = calculateSolarFillFactor({
      iscAmps: 5,
      maxPowerWatts: 5,
      vocVolts: 1.5,
    }).fillFactor;
    expect(high).toBeGreaterThan(low);
  });

  it("rejects maximum power above the voc isc product via invalid_power", () => {
    expect(
      runSolarFillFactor({ iscAmps: 2, maxPowerWatts: 10, vocVolts: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "maxPowerWatts" }] },
      ok: false,
    });
  });

  it("rejects negative maximum power via invalid_power", () => {
    expect(
      runSolarFillFactor({ iscAmps: 2, maxPowerWatts: -1, vocVolts: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "maxPowerWatts" }] },
      ok: false,
    });
  });

  it("rejects zero short-circuit current with a stable code", () => {
    expect(
      runSolarFillFactor({ iscAmps: 0, maxPowerWatts: 1, vocVolts: 2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_current", field: "iscAmps" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runSolarFillFactor({ ...solarFillFactorExample.input, ff: 1 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "ff" }] },
      ok: false,
    });
  });
});
