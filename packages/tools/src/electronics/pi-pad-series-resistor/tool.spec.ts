import { describe, expect, it } from "vitest";
import { piPadSeriesResistorExample, runPiPadSeriesResistor } from "./tool.js";

describe("Pi-Pad Series Resistor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPiPadSeriesResistor(piPadSeriesResistorExample.input)).toEqual({
      ok: true,
      output: piPadSeriesResistorExample.output,
    });
  });

  it("matches the published 50 ohm 1 dB value", () => {
    expect(runPiPadSeriesResistor({ attenuationDb: 1, zOhms: 50 })).toEqual({
      ok: true,
      output: { piSeriesResistorOhms: 5.769187904205445 },
    });
  });

  it("grows without bound as attenuation increases", () => {
    expect(runPiPadSeriesResistor({ attenuationDb: 20, zOhms: 50 })).toEqual({
      ok: true,
      output: { piSeriesResistorOhms: 247.5 },
    });
  });

  it("rejects zero attenuation with invalid_attenuation", () => {
    expect(
      runPiPadSeriesResistor({ attenuationDb: 0, zOhms: 50 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_attenuation", field: "attenuationDb" }],
      },
      ok: false,
    });
  });

  it("rejects non-positive impedance", () => {
    expect(
      runPiPadSeriesResistor({ attenuationDb: 6, zOhms: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_impedance", field: "zOhms" }] },
      ok: false,
    });
  });

  it("rejects negative attenuation through schema validation", () => {
    expect(runPiPadSeriesResistor({ attenuationDb: -6, zOhms: 50 }).ok).toBe(
      false,
    );
  });

  it("requires both inputs", () => {
    expect(runPiPadSeriesResistor({ zOhms: 50 }).ok).toBe(false);
  });
});
