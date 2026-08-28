import { describe, expect, it } from "vitest";
import { runTransmitterPowerFromEirp } from "./tool.js";
describe("TX Power From EIRP", () => {
  it("adds cable loss after subtracting antenna gain", () =>
    expect(
      runTransmitterPowerFromEirp({
        antennaGainDbi: 10,
        cableLossDb: 2,
        eirpDbm: 30,
      }),
    ).toEqual({
      ok: true,
      output: { transmitterPowerDbm: 22 },
    }));
  it("passes EIRP through with unity gain and no loss", () =>
    expect(
      runTransmitterPowerFromEirp({
        antennaGainDbi: 0,
        cableLossDb: 0,
        eirpDbm: 20,
      }),
    ).toEqual({
      ok: true,
      output: { transmitterPowerDbm: 20 },
    }));
  it("handles fractional values", () =>
    expect(
      runTransmitterPowerFromEirp({
        antennaGainDbi: 3.5,
        cableLossDb: 1.25,
        eirpDbm: 26.5,
      }),
    ).toEqual({
      ok: true,
      output: { transmitterPowerDbm: 24.25 },
    }));
  it("requires more power than EIRP when gain is small", () =>
    expect(
      runTransmitterPowerFromEirp({
        antennaGainDbi: -3,
        cableLossDb: 0,
        eirpDbm: 27,
      }),
    ).toEqual({
      ok: true,
      output: { transmitterPowerDbm: 30 },
    }));
  it("rejects non-finite inputs", () =>
    expect(
      runTransmitterPowerFromEirp({
        antennaGainDbi: Number.NaN,
        cableLossDb: 0,
        eirpDbm: 30,
      }).ok,
    ).toBe(false));
});
