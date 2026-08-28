import { describe, expect, it } from "vitest";
import { runWirePowerLoss, wirePowerLossExample } from "./tool.js";

describe("Wire Power Loss", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runWirePowerLoss(wirePowerLossExample.input)).toEqual({
      ok: true,
      output: wirePowerLossExample.output,
    }));

  it("quadruples the loss when the current doubles", () =>
    expect(
      runWirePowerLoss({
        crossSectionMm2: 1.5,
        currentAmps: 10,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 20,
      }),
    ).toEqual({ ok: true, output: { powerLossWatts: 46.66666666666667 } }));

  it("doubles the loss when the run length doubles", () =>
    expect(
      runWirePowerLoss({
        crossSectionMm2: 1.5,
        currentAmps: 5,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 40,
      }),
    ).toEqual({ ok: true, output: { powerLossWatts: 23.333333333333336 } }));

  it("is indifferent to current direction", () => {
    const forward = runWirePowerLoss(wirePowerLossExample.input);
    const reverse = runWirePowerLoss({
      ...wirePowerLossExample.input,
      currentAmps: -5,
    });
    expect(forward).toEqual(reverse);
  });

  it("rejects zero wire length", () =>
    expect(
      runWirePowerLoss({
        crossSectionMm2: 1.5,
        currentAmps: 5,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "wireLengthMeters" }],
      },
      ok: false,
    }));

  it("rejects zero resistivity", () =>
    expect(
      runWirePowerLoss({
        crossSectionMm2: 1.5,
        currentAmps: 5,
        resistivityOhmMm2PerM: 0,
        wireLengthMeters: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "resistivityOhmMm2PerM" }],
      },
      ok: false,
    }));

  it("rejects zero cross-section", () =>
    expect(
      runWirePowerLoss({
        crossSectionMm2: 0,
        currentAmps: 5,
        resistivityOhmMm2PerM: 0.0175,
        wireLengthMeters: 20,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "crossSectionMm2" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runWirePowerLoss({ currentAmps: 5 } as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
