import { describe, expect, it } from "vitest";
import { runSubstrateSupplementationPlanner } from "./tool.js";
describe("Supplementation Planner", () => {
  it("calculates a valid result", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 20,
        supplementPercentWw: 5,
      }),
    ).toEqual({ ok: true, output: { supplementMassKg: 1 } }));
  it("plans no supplement at zero percent", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 20,
        supplementPercentWw: 0,
      }),
    ).toEqual({ ok: true, output: { supplementMassKg: 0 } }));
  it("accepts thirty percent", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 10,
        supplementPercentWw: 30,
      }),
    ).toEqual({ ok: true, output: { supplementMassKg: 3 } }));
  it("handles fractional percentages", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 40,
        supplementPercentWw: 2.5,
      }),
    ).toEqual({ ok: true, output: { supplementMassKg: 1 } }));
  it("handles small substrate batches", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 0.5,
        supplementPercentWw: 10,
      }),
    ).toEqual({ ok: true, output: { supplementMassKg: 0.05 } }));
  it("does not impose an undocumented thirty-percent ceiling", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 10,
        supplementPercentWw: 35,
      }),
    ).toEqual({ ok: true, output: { supplementMassKg: 3.5 } }));
  it("rejects negative percentages", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 10,
        supplementPercentWw: -1,
      }).ok,
    ).toBe(false));
  it("rejects zero substrate", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: 0,
        supplementPercentWw: 5,
      }).ok,
    ).toBe(false));
  it("rejects negative substrate", () =>
    expect(
      runSubstrateSupplementationPlanner({
        substrateDryMassKg: -10,
        supplementPercentWw: 5,
      }).ok,
    ).toBe(false));
});
