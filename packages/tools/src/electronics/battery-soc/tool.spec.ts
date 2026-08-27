import { describe, expect, it } from "vitest";
import {
  batterySocExample,
  calculateBatterySoc,
  runBatterySoc,
} from "./tool.js";

describe("State Of Charge %", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBatterySoc(batterySocExample.input)).toEqual({
      ok: true,
      output: batterySocExample.output,
    });
  });

  it("reports one hundred percent for a full battery", () => {
    expect(runBatterySoc({ fullCapacityAh: 2.5, remainingAh: 2.5 })).toEqual({
      ok: true,
      output: { stateOfChargePercent: 100 },
    });
  });

  it("reports zero percent for an empty battery", () => {
    expect(runBatterySoc({ fullCapacityAh: 80, remainingAh: 0 })).toEqual({
      ok: true,
      output: { stateOfChargePercent: 0 },
    });
  });

  it("is the complement of depth of discharge for the same charge state", () => {
    const soc = calculateBatterySoc({
      fullCapacityAh: 50,
      remainingAh: 12.5,
    }).stateOfChargePercent;
    expect(soc).toBe(25);
  });

  it("rejects zero full capacity via invalid_charge", () => {
    expect(runBatterySoc({ fullCapacityAh: 0, remainingAh: 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "fullCapacityAh" }] },
      ok: false,
    });
  });

  it("rejects remaining above full via invalid_charge", () => {
    expect(
      runBatterySoc({ fullCapacityAh: 10, remainingAh: 10.5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "remainingAh" }] },
      ok: false,
    });
  });

  it("rejects negative remaining charge via invalid_charge", () => {
    expect(
      runBatterySoc({ fullCapacityAh: 10, remainingAh: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_charge", field: "remainingAh" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runBatterySoc({ ...batterySocExample.input, soc: 1 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "soc" }] },
      ok: false,
    });
  });
});
