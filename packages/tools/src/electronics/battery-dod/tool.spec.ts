import { describe, expect, it } from "vitest";
import {
  batteryDodExample,
  calculateBatteryDod,
  runBatteryDod,
} from "./tool.js";

describe("Depth Of Discharge %", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBatteryDod(batteryDodExample.input)).toEqual({
      ok: true,
      output: batteryDodExample.output,
    });
  });

  it("reports zero percent for a full battery", () => {
    expect(runBatteryDod({ dischargedAh: 0, fullCapacityAh: 40 })).toEqual({
      ok: true,
      output: { depthOfDischargePercent: 0 },
    });
  });

  it("reports one hundred percent for an empty battery", () => {
    expect(runBatteryDod({ dischargedAh: 40, fullCapacityAh: 40 })).toEqual({
      ok: true,
      output: { depthOfDischargePercent: 100 },
    });
  });

  it("complements state of charge for the same charge state", () => {
    const dod = calculateBatteryDod({
      dischargedAh: 37.5,
      fullCapacityAh: 50,
    }).depthOfDischargePercent;
    expect(dod).toBe(75);
  });

  it("rejects zero full capacity via invalid_charge", () => {
    expect(runBatteryDod({ dischargedAh: 1, fullCapacityAh: 0 })).toMatchObject(
      {
        error: {
          issues: [{ code: "invalid_charge", field: "fullCapacityAh" }],
        },
        ok: false,
      },
    );
  });

  it("rejects discharge above full capacity via invalid_charge", () => {
    expect(
      runBatteryDod({ dischargedAh: 41, fullCapacityAh: 40 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "dischargedAh" }] },
      ok: false,
    });
  });

  it("rejects negative discharge via invalid_charge", () => {
    expect(
      runBatteryDod({ dischargedAh: -0.5, fullCapacityAh: 40 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "dischargedAh" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runBatteryDod({ dischargedAh: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "fullCapacityAh" }] },
      ok: false,
    });
  });
});
