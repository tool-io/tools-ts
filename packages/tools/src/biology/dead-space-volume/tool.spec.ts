import { describe, expect, it } from "vitest";
import { deadSpaceVolumeExample, runDeadSpaceVolume } from "./tool.js";

describe("Bohr Dead Space", () => {
  it("publishes an executable example", () =>
    expect(runDeadSpaceVolume(deadSpaceVolumeExample.input)).toEqual({
      ok: true,
      output: deadSpaceVolumeExample.output,
    }));
  it("yields zero when EtCO2 equals PaCO2", () =>
    expect(
      runDeadSpaceVolume({
        etco2Mmhg: 40,
        paco2Mmhg: 40,
        tidalVolumeMl: 500,
      }),
    ).toEqual({ ok: true, output: { deadSpaceMl: 0 } }));
  it("scales the tidal volume by the CO2 gap fraction", () =>
    expect(
      runDeadSpaceVolume({
        etco2Mmhg: 28,
        paco2Mmhg: 40,
        tidalVolumeMl: 450,
      }),
    ).toEqual({ ok: true, output: { deadSpaceMl: 135 } }));
  it("produces fractional dead space volumes", () =>
    expect(
      runDeadSpaceVolume({
        etco2Mmhg: 35,
        paco2Mmhg: 45,
        tidalVolumeMl: 600,
      }),
    ).toEqual({ ok: true, output: { deadSpaceMl: 133.33333333333334 } }));
  it("rejects EtCO2 above PaCO2 with invalid_co2", () => {
    const result = runDeadSpaceVolume({
      etco2Mmhg: 50,
      paco2Mmhg: 40,
      tidalVolumeMl: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_co2");
  });
  it("rejects zero tidal volume", () =>
    expect(
      runDeadSpaceVolume({
        etco2Mmhg: 30,
        paco2Mmhg: 40,
        tidalVolumeMl: 0,
      }).ok,
    ).toBe(false));
  it("rejects zero PaCO2", () =>
    expect(
      runDeadSpaceVolume({
        etco2Mmhg: 30,
        paco2Mmhg: 0,
        tidalVolumeMl: 500,
      }).ok,
    ).toBe(false));
  it("rejects negative EtCO2", () =>
    expect(
      runDeadSpaceVolume({
        etco2Mmhg: -5,
        paco2Mmhg: 40,
        tidalVolumeMl: 500,
      }).ok,
    ).toBe(false));
  it("rejects missing inputs", () =>
    expect(runDeadSpaceVolume({ paco2Mmhg: 40 }).ok).toBe(false));
});
