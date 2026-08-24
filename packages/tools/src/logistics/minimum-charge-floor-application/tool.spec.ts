import { describe, expect, it } from "vitest";
import {
  calculateMinimumChargeFloorApplication,
  minimumChargeFloorApplicationExample,
  runMinimumChargeFloorApplication,
} from "./tool.js";

describe("minimum-charge-floor-application", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMinimumChargeFloorApplication(
        minimumChargeFloorApplicationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: minimumChargeFloorApplicationExample.output,
    });
  });

  it("leaves charges above the floor untouched", () => {
    expect(
      runMinimumChargeFloorApplication({
        quotedChargeUsd: 300,
        minimumChargeUsd: 225.5,
      }),
    ).toEqual({
      ok: true,
      output: { billedChargeUsd: 300, floorApplied: false, shortfallUsd: 0 },
    });
  });

  it("does not apply the floor when the amounts are equal", () => {
    expect(
      calculateMinimumChargeFloorApplication({
        minimumChargeUsd: 100,
        quotedChargeUsd: 100,
      }),
    ).toEqual({ billedChargeUsd: 100, floorApplied: false, shortfallUsd: 0 });
  });

  it("rejects invalid direct and public amounts", () => {
    expect(() =>
      calculateMinimumChargeFloorApplication({
        minimumChargeUsd: 100,
        quotedChargeUsd: Number.NaN,
      }),
    ).toThrow("must be finite");
    expect(
      runMinimumChargeFloorApplication({
        minimumChargeUsd: 100,
        quotedChargeUsd: -5,
      }).ok,
    ).toBe(false);
  });
});
