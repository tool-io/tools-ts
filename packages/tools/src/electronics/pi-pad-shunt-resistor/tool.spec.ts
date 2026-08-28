import { describe, expect, it } from "vitest";
import { piPadShuntResistorExample, runPiPadShuntResistor } from "./tool.js";

describe("Pi-Pad Shunt Resistor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPiPadShuntResistor(piPadShuntResistorExample.input)).toEqual({
      ok: true,
      output: piPadShuntResistorExample.output,
    });
  });

  it("matches the published 50 ohm 1 dB shunt value of about 870 ohms", () => {
    expect(runPiPadShuntResistor({ attenuationDb: 1, zOhms: 50 })).toEqual({
      ok: true,
      output: { piShuntResistorOhms: 869.5481623830974 },
    });
  });

  it("matches the published 50 ohm 3 dB shunt value of about 292 ohms", () => {
    expect(runPiPadShuntResistor({ attenuationDb: 3, zOhms: 50 })).toEqual({
      ok: true,
      output: { piShuntResistorOhms: 292.402179640268 },
    });
  });

  it("settles toward the system impedance at high attenuation", () => {
    expect(runPiPadShuntResistor({ attenuationDb: 20, zOhms: 50 })).toEqual({
      ok: true,
      output: { piShuntResistorOhms: 61.111111111111114 },
    });
  });

  it("rejects zero attenuation with invalid_attenuation", () => {
    expect(
      runPiPadShuntResistor({ attenuationDb: 0, zOhms: 50 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_attenuation", field: "attenuationDb" }],
      },
      ok: false,
    });
  });

  it("rejects negative attenuation through schema validation", () => {
    expect(runPiPadShuntResistor({ attenuationDb: -6, zOhms: 50 }).ok).toBe(
      false,
    );
  });

  it("rejects non-positive impedance", () => {
    expect(runPiPadShuntResistor({ attenuationDb: 6, zOhms: -50 }).ok).toBe(
      false,
    );
  });
});
