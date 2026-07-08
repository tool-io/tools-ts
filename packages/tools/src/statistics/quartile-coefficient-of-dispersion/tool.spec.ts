import { describe, expect, it } from "vitest";
import { runQuartileCoefficientOfDispersion } from "./tool.js";
describe("Quartile Coefficient of Dispersion Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runQuartileCoefficientOfDispersion({
        firstQuartile: 10,
        thirdQuartile: 30,
      }),
    ).toEqual({ ok: true, output: { coefficient: 0.5 } });
  });
  it("rejects invalid input", () =>
    expect(runQuartileCoefficientOfDispersion(null).ok).toBe(false));
});
