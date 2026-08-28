import { describe, expect, it } from "vitest";
import { runSystemNoiseTemperature } from "./tool.js";

describe("System Noise Temp", () => {
  it("calculates a valid result", () =>
    expect(
      runSystemNoiseTemperature({ tAntennaK: 150, tReceiverK: 75 }),
    ).toEqual({
      ok: true,
      output: { systemNoiseTemperatureK: 225 },
    }));
  it("sums to zero for a cold system", () =>
    expect(runSystemNoiseTemperature({ tAntennaK: 0, tReceiverK: 0 })).toEqual({
      ok: true,
      output: { systemNoiseTemperatureK: 0 },
    }));
  it("handles a receiver-only contribution", () =>
    expect(runSystemNoiseTemperature({ tAntennaK: 0, tReceiverK: 42 })).toEqual(
      {
        ok: true,
        output: { systemNoiseTemperatureK: 42 },
      },
    ));
  it("handles fractional temperatures", () =>
    expect(
      runSystemNoiseTemperature({ tAntennaK: 12.5, tReceiverK: 7.25 }),
    ).toEqual({
      ok: true,
      output: { systemNoiseTemperatureK: 19.75 },
    }));
  it("handles cryogenic systems", () =>
    expect(runSystemNoiseTemperature({ tAntennaK: 15, tReceiverK: 4 })).toEqual(
      {
        ok: true,
        output: { systemNoiseTemperatureK: 19 },
      },
    ));
  it("rejects negative antenna temperature", () =>
    expect(
      runSystemNoiseTemperature({ tAntennaK: -1, tReceiverK: 75 }).ok,
    ).toBe(false));
  it("rejects negative receiver temperature", () =>
    expect(
      runSystemNoiseTemperature({ tAntennaK: 150, tReceiverK: -0.5 }).ok,
    ).toBe(false));
});
