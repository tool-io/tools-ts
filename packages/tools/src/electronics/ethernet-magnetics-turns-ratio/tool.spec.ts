import { describe, expect, it } from "vitest";
import { runEthernetMagneticsTurnsRatio } from "./tool.js";
describe("Ethernet Turns Ratio", () => {
  it("calculates a 2:1 ratio for 100 to 25 ohms", () =>
    expect(
      runEthernetMagneticsTurnsRatio({
        lineImpedanceOhms: 100,
        portImpedanceOhms: 25,
      }),
    ).toEqual({
      ok: true,
      output: { turnsRatio: 2 },
    }));
  it("returns unity for equal impedances", () =>
    expect(
      runEthernetMagneticsTurnsRatio({
        lineImpedanceOhms: 100,
        portImpedanceOhms: 100,
      }),
    ).toEqual({
      ok: true,
      output: { turnsRatio: 1 },
    }));
  it("calculates the square root of three for 150 to 50 ohms", () =>
    expect(
      runEthernetMagneticsTurnsRatio({
        lineImpedanceOhms: 150,
        portImpedanceOhms: 50,
      }),
    ).toEqual({
      ok: true,
      output: { turnsRatio: 1.7320508075688772 },
    }));
  it("rejects a zero line-side impedance", () =>
    expect(
      runEthernetMagneticsTurnsRatio({
        lineImpedanceOhms: 0,
        portImpedanceOhms: 25,
      }).ok,
    ).toBe(false));
  it("rejects a zero port-side impedance", () =>
    expect(
      runEthernetMagneticsTurnsRatio({
        lineImpedanceOhms: 100,
        portImpedanceOhms: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative impedances", () =>
    expect(
      runEthernetMagneticsTurnsRatio({
        lineImpedanceOhms: -100,
        portImpedanceOhms: 25,
      }).ok,
    ).toBe(false));
});
