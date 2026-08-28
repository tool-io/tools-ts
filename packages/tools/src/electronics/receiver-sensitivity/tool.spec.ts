import { describe, expect, it } from "vitest";
import { runReceiverSensitivity } from "./tool.js";
describe("Receiver Sensitivity", () => {
  it("calculates a typical sensitivity", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: 1e7,
        noiseFigureDb: 3,
        requiredSnrDb: 10,
      }),
    ).toEqual({
      ok: true,
      output: { receiverSensitivityDbm: -91 },
    }));
  it("reduces to the thermal floor for one hertz and zero figures", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: 1,
        noiseFigureDb: 0,
        requiredSnrDb: 0,
      }),
    ).toEqual({
      ok: true,
      output: { receiverSensitivityDbm: -174 },
    }));
  it("calculates a narrowband case", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: 1e6,
        noiseFigureDb: 0,
        requiredSnrDb: 20,
      }),
    ).toEqual({
      ok: true,
      output: { receiverSensitivityDbm: -94 },
    }));
  it("degrades with the noise figure", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: 1e6,
        noiseFigureDb: 6,
        requiredSnrDb: 0,
      }),
    ).toEqual({
      ok: true,
      output: { receiverSensitivityDbm: -108 },
    }));
  it("rejects a zero bandwidth", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: 0,
        noiseFigureDb: 3,
        requiredSnrDb: 10,
      }).ok,
    ).toBe(false));
  it("rejects a negative bandwidth", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: -100,
        noiseFigureDb: 3,
        requiredSnrDb: 10,
      }).ok,
    ).toBe(false));
  it("rejects a negative noise figure", () =>
    expect(
      runReceiverSensitivity({
        bandwidthHz: 1e6,
        noiseFigureDb: -1,
        requiredSnrDb: 10,
      }).ok,
    ).toBe(false));
});
