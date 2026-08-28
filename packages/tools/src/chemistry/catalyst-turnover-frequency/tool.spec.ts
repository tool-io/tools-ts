import { describe, expect, it } from "vitest";
import { runCatalystTurnoverFrequency } from "./tool.js";
describe("Turnover Frequency", () => {
  it("calculates a valid result", () =>
    expect(
      runCatalystTurnoverFrequency({
        catalystMoles: 0.00001,
        productMolesPerSecond: 0.002,
      }),
    ).toEqual({
      ok: true,
      output: { turnoverFrequencyPerS: 200 },
    }));
  it("rejects invalid input", () =>
    expect(
      runCatalystTurnoverFrequency({
        catalystMoles: 0,
        productMolesPerSecond: 0.002,
      }).ok,
    ).toBe(false));
});
