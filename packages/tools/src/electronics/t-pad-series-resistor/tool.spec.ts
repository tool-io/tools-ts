import { describe, expect, it } from "vitest";
import { runTPadSeriesResistor, tPadSeriesResistorExample } from "./tool.js";

describe("T-Pad Series Resistor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTPadSeriesResistor(tPadSeriesResistorExample.input)).toEqual({
      ok: true,
      output: tPadSeriesResistorExample.output,
    });
  });

  it("matches the published 50 ohm 3 dB value", () => {
    expect(runTPadSeriesResistor({ attenuationDb: 3, zOhms: 50 })).toEqual({
      ok: true,
      output: { seriesResistorOhms: 8.549867867180952 },
    });
  });

  it("approaches half the impedance at very high attenuation", () => {
    expect(runTPadSeriesResistor({ attenuationDb: 20, zOhms: 50 })).toEqual({
      ok: true,
      output: { seriesResistorOhms: 40.90909090909091 },
    });
  });

  it("scales with the system impedance", () => {
    expect(runTPadSeriesResistor({ attenuationDb: 20, zOhms: 75 })).toEqual({
      ok: true,
      output: { seriesResistorOhms: 61.36363636363637 },
    });
  });

  it("rejects zero attenuation with invalid_attenuation", () => {
    expect(
      runTPadSeriesResistor({ attenuationDb: 0, zOhms: 50 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_attenuation", field: "attenuationDb" }],
      },
      ok: false,
    });
  });

  it("rejects non-positive impedance", () => {
    expect(runTPadSeriesResistor({ attenuationDb: 6, zOhms: 0 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_impedance", field: "zOhms" }] },
        ok: false,
      },
    );
  });

  it("rejects negative attenuation through schema validation", () => {
    expect(runTPadSeriesResistor({ attenuationDb: -6, zOhms: 50 }).ok).toBe(
      false,
    );
  });
});
