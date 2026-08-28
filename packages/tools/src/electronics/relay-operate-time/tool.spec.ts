import { describe, expect, it } from "vitest";
import {
  calculateRelayOperateTime,
  relayOperateTimeExample,
  runRelayOperateTime,
} from "./tool.js";

describe("Relay Operate Time", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRelayOperateTime(relayOperateTimeExample.input)).toEqual({
      ok: true,
      output: relayOperateTimeExample.output,
    });
  });

  it("grows rapidly as pickup nears the supply", () => {
    const near = runRelayOperateTime({
      coilInductanceMH: 50,
      coilResistanceOhms: 100,
      pickupVolts: 11.999,
      supplyVolts: 12,
    });
    const half = calculateRelayOperateTime({
      coilInductanceMH: 50,
      coilResistanceOhms: 100,
      pickupVolts: 6,
      supplyVolts: 12,
    }).operateTimeMs;
    expect(near).toEqual({
      ok: true,
      output: { operateTimeMs: 4696.330964385345 },
    });
    expect(near.ok && near.output.operateTimeMs).toBeGreaterThan(half * 13);
  });

  it("scales linearly with the L/R time constant", () => {
    const a = calculateRelayOperateTime({
      coilInductanceMH: 25,
      coilResistanceOhms: 100,
      pickupVolts: 6,
      supplyVolts: 12,
    }).operateTimeMs;
    const b = calculateRelayOperateTime({
      coilInductanceMH: 50,
      coilResistanceOhms: 200,
      pickupVolts: 6,
      supplyVolts: 12,
    }).operateTimeMs;
    expect(a).toBe(b);
  });

  it("rejects zero inductance via invalid_inductance", () => {
    expect(
      runRelayOperateTime({
        coilInductanceMH: 0,
        coilResistanceOhms: 100,
        pickupVolts: 6,
        supplyVolts: 12,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_inductance", field: "coilInductanceMH" }],
      },
      ok: false,
    });
  });

  it("rejects zero resistance via invalid_resistance", () => {
    expect(
      runRelayOperateTime({
        coilInductanceMH: 50,
        coilResistanceOhms: 0,
        pickupVolts: 6,
        supplyVolts: 12,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "coilResistanceOhms" }],
      },
      ok: false,
    });
  });

  it("rejects zero supply via invalid_supply", () => {
    expect(
      runRelayOperateTime({
        coilInductanceMH: 50,
        coilResistanceOhms: 100,
        pickupVolts: 0.5,
        supplyVolts: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_supply", field: "supplyVolts" }] },
      ok: false,
    });
  });

  it("rejects pickup at or above supply via insufficient_supply", () => {
    expect(
      runRelayOperateTime({
        coilInductanceMH: 50,
        coilResistanceOhms: 100,
        pickupVolts: 12,
        supplyVolts: 12,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "insufficient_supply", field: "pickupVolts" }],
      },
      ok: false,
    });
  });

  it("rejects pickup above supply via insufficient_supply", () => {
    expect(
      runRelayOperateTime({
        coilInductanceMH: 50,
        coilResistanceOhms: 100,
        pickupVolts: 13,
        supplyVolts: 12,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "insufficient_supply", field: "pickupVolts" }],
      },
      ok: false,
    });
  });
});
