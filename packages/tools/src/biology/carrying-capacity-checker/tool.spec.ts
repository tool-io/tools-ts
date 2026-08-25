import { describe, expect, it } from "vitest";
import {
  carryingCapacityCheckerExample,
  runCarryingCapacityChecker,
} from "./tool.js";

describe("Carrying Capacity Check", () => {
  it("publishes an executable example", () =>
    expect(
      runCarryingCapacityChecker(carryingCapacityCheckerExample.input),
    ).toEqual({
      ok: true,
      output: carryingCapacityCheckerExample.output,
    }));
  it("reports false below capacity", () =>
    expect(
      runCarryingCapacityChecker({
        carryingCapacity: 100,
        currentPopulation: 99,
      }),
    ).toEqual({ ok: true, output: { exceedsCapacity: false } }));
  it("reports false exactly at capacity", () =>
    expect(
      runCarryingCapacityChecker({
        carryingCapacity: 100,
        currentPopulation: 100,
      }),
    ).toEqual({ ok: true, output: { exceedsCapacity: false } }));
  it("accepts an empty population", () =>
    expect(
      runCarryingCapacityChecker({
        carryingCapacity: 100,
        currentPopulation: 0,
      }),
    ).toEqual({ ok: true, output: { exceedsCapacity: false } }));
  it("reports a population above a zero carrying capacity", () =>
    expect(
      runCarryingCapacityChecker({
        carryingCapacity: 0,
        currentPopulation: 10,
      }),
    ).toEqual({ ok: true, output: { exceedsCapacity: true } }));
  it("rejects non-finite input", () => {
    const result = runCarryingCapacityChecker({
      carryingCapacity: Number.POSITIVE_INFINITY,
      currentPopulation: 10,
    });
    expect(result.ok).toBe(false);
  });
});
