import { describe, expect, it } from "vitest";
import { boostDutyCycleExample, runBoostDutyCycle } from "./tool.js";
describe("Boost Duty Cycle", () => {
  it("publishes an executable example", () =>
    expect(runBoostDutyCycle(boostDutyCycleExample.input)).toEqual({
      ok: true,
      output: boostDutyCycleExample.output,
    }));
  it("computes a fractional duty cycle", () =>
    expect(runBoostDutyCycle({ vIn: 3, vOut: 4 })).toEqual({
      ok: true,
      output: { dutyCyclePercent: 25 },
    }));
  it("rejects non-boost ratios", () =>
    expect(runBoostDutyCycle({ vIn: 10, vOut: 10 }).ok).toBe(false));
  it("rejects non-positive input voltage", () =>
    expect(runBoostDutyCycle({ vIn: 0, vOut: 10 }).ok).toBe(false));
});
