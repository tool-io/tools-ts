import { describe, expect, it } from "vitest";
import { runTPadShuntResistor, tPadShuntResistorExample } from "./tool.js";

describe("T-Pad Shunt Resistor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTPadShuntResistor(tPadShuntResistorExample.input)).toEqual({
      ok: true,
      output: tPadShuntResistorExample.output,
    });
  });

  it("matches the published 50 ohm 3 dB value", () => {
    expect(runTPadShuntResistor({ attenuationDb: 3, zOhms: 50 })).toEqual({
      ok: true,
      output: { shuntResistorOhms: 141.92615588654354 },
    });
  });

  it("falls toward zero as attenuation grows very large", () => {
    expect(runTPadShuntResistor({ attenuationDb: 20, zOhms: 50 })).toEqual({
      ok: true,
      output: { shuntResistorOhms: 10.1010101010101 },
    });
  });

  it("rejects zero attenuation with invalid_attenuation", () => {
    expect(runTPadShuntResistor({ attenuationDb: 0, zOhms: 50 })).toMatchObject(
      {
        error: {
          issues: [{ code: "invalid_attenuation", field: "attenuationDb" }],
        },
        ok: false,
      },
    );
  });

  it("rejects non-positive impedance", () => {
    expect(runTPadShuntResistor({ attenuationDb: 6, zOhms: 0 })).toMatchObject({
      error: { issues: [{ code: "invalid_impedance", field: "zOhms" }] },
      ok: false,
    });
  });

  it("rejects negative attenuation through schema validation", () => {
    expect(runTPadShuntResistor({ attenuationDb: -3, zOhms: 50 }).ok).toBe(
      false,
    );
  });

  it("requires both inputs", () => {
    expect(runTPadShuntResistor({ attenuationDb: 6 }).ok).toBe(false);
  });
});
