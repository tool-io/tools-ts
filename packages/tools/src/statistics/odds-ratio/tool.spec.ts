import { describe, expect, it } from "vitest";
import { oddsRatioExample, runOddsRatio } from "./tool.js";
describe("Odds Ratio Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runOddsRatio({
        exposedEvent: 20,
        exposedNoEvent: 80,
        controlEvent: 10,
        controlNoEvent: 90,
      }),
    ).toEqual({ ok: true, output: { oddsRatio: 2.25 } });
  });
  it("rejects invalid input", () => expect(runOddsRatio(null).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runOddsRatio(oddsRatioExample.input).ok).toBe(true));
});
