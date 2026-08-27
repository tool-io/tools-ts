import { describe, expect, it } from "vitest";
import {
  batteryDischargeDepthExample,
  calculateBatteryDischargeDepth,
  runBatteryDischargeDepth,
} from "./tool.js";

describe("Discharge Depth Percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBatteryDischargeDepth(batteryDischargeDepthExample.input),
    ).toEqual({
      ok: true,
      output: batteryDischargeDepthExample.output,
    });
  });

  it("reports zero percent for an untouched battery", () => {
    expect(runBatteryDischargeDepth({ fullAh: 40, usedAh: 0 })).toEqual({
      ok: true,
      output: { dischargeDepthPercent: 0 },
    });
  });

  it("reports one hundred percent for a fully drained battery", () => {
    expect(runBatteryDischargeDepth({ fullAh: 40, usedAh: 40 })).toEqual({
      ok: true,
      output: { dischargeDepthPercent: 100 },
    });
  });

  it("matches a half-discharged pack", () => {
    expect(
      calculateBatteryDischargeDepth({ fullAh: 100, usedAh: 50 })
        .dischargeDepthPercent,
    ).toBe(50);
  });

  it("rejects zero full capacity via invalid_charge", () => {
    expect(runBatteryDischargeDepth({ fullAh: 0, usedAh: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "fullAh" }] },
      ok: false,
    });
  });

  it("rejects usage above full capacity via invalid_charge", () => {
    expect(runBatteryDischargeDepth({ fullAh: 40, usedAh: 41 })).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "usedAh" }] },
      ok: false,
    });
  });

  it("rejects negative usage via invalid_charge", () => {
    expect(runBatteryDischargeDepth({ fullAh: 40, usedAh: -1 })).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "usedAh" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runBatteryDischargeDepth({ usedAh: 5 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "fullAh" }] },
      ok: false,
    });
  });
});
