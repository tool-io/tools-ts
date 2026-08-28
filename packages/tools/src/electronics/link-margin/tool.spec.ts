import { describe, expect, it } from "vitest";
import { runLinkMargin } from "./tool.js";
describe("Link Margin dB", () => {
  it("calculates a positive margin", () =>
    expect(
      runLinkMargin({
        eirpDbm: 20,
        fsplDb: 100,
        rxGainDbi: 2,
        rxSensitivityDbm: -100,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: 22 },
    }));
  it("calculates a slim margin", () =>
    expect(
      runLinkMargin({
        eirpDbm: 30,
        fsplDb: 120,
        rxGainDbi: 0,
        rxSensitivityDbm: -95,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: 5 },
    }));
  it("returns a negative margin when the budget fails", () =>
    expect(
      runLinkMargin({
        eirpDbm: 10,
        fsplDb: 150,
        rxGainDbi: 0,
        rxSensitivityDbm: -100,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: -40 },
    }));
  it("accepts fractional inputs", () =>
    expect(
      runLinkMargin({
        eirpDbm: 26.5,
        fsplDb: 98.5,
        rxGainDbi: 1.5,
        rxSensitivityDbm: -80,
      }),
    ).toEqual({
      ok: true,
      output: { linkMarginDb: 9.5 },
    }));
  it("rejects non-finite inputs", () =>
    expect(
      runLinkMargin({
        eirpDbm: Number.POSITIVE_INFINITY,
        fsplDb: 100,
        rxGainDbi: 2,
        rxSensitivityDbm: -100,
      }).ok,
    ).toBe(false));
});
