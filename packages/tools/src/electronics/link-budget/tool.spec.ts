import { describe, expect, it } from "vitest";
import { runLinkBudget } from "./tool.js";

describe("Link Budget Margin", () => {
  it("calculates a valid result", () =>
    expect(
      runLinkBudget({
        eirpDbm: 20,
        rxGainDb: 15,
        pathLossDb: 120,
        rxSensitivityDbm: -100,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: 15 },
    }));
  it("returns zero for a closed link with no margin", () =>
    expect(
      runLinkBudget({
        eirpDbm: 30,
        rxGainDb: 0,
        pathLossDb: 120,
        rxSensitivityDbm: -90,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: 0 },
    }));
  it("returns negative margin when the link fails", () =>
    expect(
      runLinkBudget({
        eirpDbm: 20,
        rxGainDb: 0,
        pathLossDb: 130,
        rxSensitivityDbm: -100,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: -10 },
    }));
  it("supports negative receiver gain", () =>
    expect(
      runLinkBudget({
        eirpDbm: 20,
        rxGainDb: -2,
        pathLossDb: 100,
        rxSensitivityDbm: -100,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: 18 },
    }));
  it("rejects a non-finite EIRP", () =>
    expect(
      runLinkBudget({
        eirpDbm: Number.NaN,
        rxGainDb: 0,
        pathLossDb: 100,
        rxSensitivityDbm: -100,
      }).ok,
    ).toBe(false));
  it("rejects a non-finite path loss", () =>
    expect(
      runLinkBudget({
        eirpDbm: 20,
        rxGainDb: 0,
        pathLossDb: Number.POSITIVE_INFINITY,
        rxSensitivityDbm: -100,
      }).ok,
    ).toBe(false));
});
