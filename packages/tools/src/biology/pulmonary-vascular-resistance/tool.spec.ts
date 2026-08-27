import { describe, expect, it } from "vitest";
import {
  pulmonaryVascularResistanceExample,
  runPulmonaryVascularResistance,
} from "./tool.js";

describe("PVR Calculator", () => {
  it("publishes an executable example", () =>
    expect(
      runPulmonaryVascularResistance(pulmonaryVascularResistanceExample.input),
    ).toEqual({
      ok: true,
      output: pulmonaryVascularResistanceExample.output,
    }));
  it("computes another valid result", () =>
    expect(
      runPulmonaryVascularResistance({
        meanPapMmhg: 25,
        leftAtrialMmhg: 12,
        cardiacOutputLPerMin: 4,
      }),
    ).toEqual({ ok: true, output: { pvrWoodUnits: 3.25 } }));
  it("allows equal pressures yielding zero", () =>
    expect(
      runPulmonaryVascularResistance({
        meanPapMmhg: 20,
        leftAtrialMmhg: 20,
        cardiacOutputLPerMin: 5,
      }),
    ).toEqual({ ok: true, output: { pvrWoodUnits: 0 } }));
  it("divides a larger gradient by higher flow", () =>
    expect(
      runPulmonaryVascularResistance({
        meanPapMmhg: 24,
        leftAtrialMmhg: 8,
        cardiacOutputLPerMin: 6.4,
      }),
    ).toEqual({ ok: true, output: { pvrWoodUnits: 2.5 } }));
  it("rejects mean PAP below left atrial pressure", () => {
    const result = runPulmonaryVascularResistance({
      meanPapMmhg: 10,
      leftAtrialMmhg: 18,
      cardiacOutputLPerMin: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("negative_gradient");
  });
  it("rejects zero cardiac output", () => {
    const result = runPulmonaryVascularResistance({
      meanPapMmhg: 15,
      leftAtrialMmhg: 5,
      cardiacOutputLPerMin: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
});
