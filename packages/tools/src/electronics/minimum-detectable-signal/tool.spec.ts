import { describe, expect, it } from "vitest";
import { runMinimumDetectableSignal } from "./tool.js";

describe("MDS Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 1000000,
        noiseFigureDb: 3,
        requiredSnrDb: 10,
      }),
    ).toEqual({
      ok: true,
      output: { minimumDetectableSignalDbm: -101 },
    }));
  it("reduces to the thermal floor at one hertz", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 1,
        noiseFigureDb: 0,
        requiredSnrDb: 0,
      }),
    ).toEqual({
      ok: true,
      output: { minimumDetectableSignalDbm: -174 },
    }));
  it("adds forty decibels for ten kilohertz", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 10000,
        noiseFigureDb: 0,
        requiredSnrDb: 0,
      }),
    ).toEqual({
      ok: true,
      output: { minimumDetectableSignalDbm: -134 },
    }));
  it("combines noise figure and required SNR", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 1000000000,
        noiseFigureDb: 2.5,
        requiredSnrDb: 15,
      }),
    ).toEqual({
      ok: true,
      output: { minimumDetectableSignalDbm: -66.5 },
    }));
  it("rejects zero bandwidth", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 0,
        noiseFigureDb: 3,
        requiredSnrDb: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative bandwidth", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: -1,
        noiseFigureDb: 3,
        requiredSnrDb: 10,
      }).ok,
    ).toBe(false));
  it("rejects negative noise figure", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 1000000,
        noiseFigureDb: -1,
        requiredSnrDb: 10,
      }).ok,
    ).toBe(false));
  it("rejects a non-finite required SNR", () =>
    expect(
      runMinimumDetectableSignal({
        bandwidthHz: 1000000,
        noiseFigureDb: 3,
        requiredSnrDb: Number.NaN,
      }).ok,
    ).toBe(false));
});
