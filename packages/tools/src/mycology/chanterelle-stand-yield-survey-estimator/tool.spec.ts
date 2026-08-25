import { describe, expect, it } from "vitest";
import { runChanterelleStandYieldSurveyEstimator } from "./tool.js";
describe("Stand Yield Estimate", () => {
  it("calculates a valid result", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 250,
        patchesCountedInt: 40,
      }),
    ).toEqual({ ok: true, output: { standYieldKg: 10 } }));
  it("yields zero without patches", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 250,
        patchesCountedInt: 0,
      }),
    ).toEqual({ ok: true, output: { standYieldKg: 0 } }));
  it("yields zero with barren patches", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 0,
        patchesCountedInt: 25,
      }),
    ).toEqual({ ok: true, output: { standYieldKg: 0 } }));
  it("handles fractional yields", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 123.5,
        patchesCountedInt: 10,
      }),
    ).toEqual({ ok: true, output: { standYieldKg: 1.235 } }));
  it("converts single patch grams to kilograms", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 500,
        patchesCountedInt: 1,
      }),
    ).toEqual({ ok: true, output: { standYieldKg: 0.5 } }));
  it("scales to large surveys", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 180,
        patchesCountedInt: 1200,
      }),
    ).toEqual({ ok: true, output: { standYieldKg: 216 } }));
  it("rejects negative patch counts", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: 100,
        patchesCountedInt: -1,
      }).ok,
    ).toBe(false));
  it("rejects negative yields", () =>
    expect(
      runChanterelleStandYieldSurveyEstimator({
        meanPatchYieldG: -5,
        patchesCountedInt: 10,
      }).ok,
    ).toBe(false));
});
