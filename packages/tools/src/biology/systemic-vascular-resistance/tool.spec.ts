import { describe, expect, it } from "vitest";
import {
  runSystemicVascularResistance,
  systemicVascularResistanceExample,
} from "./tool.js";

describe("SVR Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runSystemicVascularResistance(systemicVascularResistanceExample.input),
    ).toEqual({
      ok: true,
      output: systemicVascularResistanceExample.output,
    }));
  it("computes canonical SVR", () =>
    expect(
      runSystemicVascularResistance({
        meanArterialMmhg: 90,
        centralVenousMmhg: 5,
        cardiacOutputLPerMin: 5,
      }),
    ).toEqual({ ok: true, output: { svrDynesSCm5: 1360 } }));
  it("allows equal pressures yielding zero", () =>
    expect(
      runSystemicVascularResistance({
        meanArterialMmhg: 80,
        centralVenousMmhg: 80,
        cardiacOutputLPerMin: 4,
      }),
    ).toEqual({ ok: true, output: { svrDynesSCm5: 0 } }));
  it("computes another valid result", () =>
    expect(
      runSystemicVascularResistance({
        meanArterialMmhg: 95,
        centralVenousMmhg: 2,
        cardiacOutputLPerMin: 4.5,
      }),
    ).toEqual({ ok: true, output: { svrDynesSCm5: 1653.3333333333333 } }));
  it("rejects MAP below CVP", () => {
    const result = runSystemicVascularResistance({
      meanArterialMmhg: 50,
      centralVenousMmhg: 60,
      cardiacOutputLPerMin: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_gradient");
  });
  it("rejects zero cardiac output", () => {
    const result = runSystemicVascularResistance({
      meanArterialMmhg: 90,
      centralVenousMmhg: 5,
      cardiacOutputLPerMin: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative cardiac output", () => {
    const result = runSystemicVascularResistance({
      meanArterialMmhg: 90,
      centralVenousMmhg: 5,
      cardiacOutputLPerMin: -5,
    });
    expect(result.ok).toBe(false);
  });
});
