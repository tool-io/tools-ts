import { describe, expect, it } from "vitest";
import {
  refractoryPeriodAbsoluteExample,
  runRefractoryPeriodAbsolute,
} from "./tool.js";

describe("Absolute Refractory Check", () => {
  it("publishes an executable example", () =>
    expect(
      runRefractoryPeriodAbsolute(refractoryPeriodAbsoluteExample.input),
    ).toEqual({
      ok: true,
      output: refractoryPeriodAbsoluteExample.output,
    }));
  it("recovers after the default window", () =>
    expect(runRefractoryPeriodAbsolute({ elapsedMs: 1.5 })).toEqual({
      ok: true,
      output: { absoluteRefractoryMs: 1, isInRefractory: false },
    }));
  it("echoes a custom window", () =>
    expect(
      runRefractoryPeriodAbsolute({
        absoluteRefractoryMs: 4,
        elapsedMs: 3,
      }),
    ).toEqual({
      ok: true,
      output: { absoluteRefractoryMs: 4, isInRefractory: true },
    }));
  it("releases exactly at the boundary", () =>
    expect(
      runRefractoryPeriodAbsolute({ absoluteRefractoryMs: 1, elapsedMs: 1 }),
    ).toEqual({
      ok: true,
      output: { absoluteRefractoryMs: 1, isInRefractory: false },
    }));
  it("blocks immediately after a spike", () =>
    expect(runRefractoryPeriodAbsolute({ elapsedMs: 0 })).toEqual({
      ok: true,
      output: { absoluteRefractoryMs: 1, isInRefractory: true },
    }));
  it("rejects negative elapsed time", () =>
    expect(runRefractoryPeriodAbsolute({ elapsedMs: -0.5 }).ok).toBe(false));
  it("rejects windows above ten milliseconds", () =>
    expect(
      runRefractoryPeriodAbsolute({
        absoluteRefractoryMs: 11,
        elapsedMs: 5,
      }).ok,
    ).toBe(false));
  it("rejects windows below the minimum", () =>
    expect(
      runRefractoryPeriodAbsolute({
        absoluteRefractoryMs: 0.05,
        elapsedMs: 0.01,
      }).ok,
    ).toBe(false));
});
