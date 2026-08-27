import { describe, expect, it } from "vitest";
import { runCanBusTerminationResistance } from "./tool.js";
describe("CAN Termination Check", () => {
  it("defaults to two terminators at sixty ohms", () =>
    expect(runCanBusTerminationResistance({})).toEqual({
      ok: true,
      output: { effectiveTerminationOhms: 60 },
    }));
  it("yields sixty ohms for two terminators", () =>
    expect(runCanBusTerminationResistance({ terminatorCount: 2 })).toEqual({
      ok: true,
      output: { effectiveTerminationOhms: 60 },
    }));
  it("yields one hundred twenty ohms for a single terminator", () =>
    expect(runCanBusTerminationResistance({ terminatorCount: 1 })).toEqual({
      ok: true,
      output: { effectiveTerminationOhms: 120 },
    }));
  it("rejects zero terminators", () =>
    expect(runCanBusTerminationResistance({ terminatorCount: 0 }).ok).toBe(
      false,
    ));
  it("rejects three terminators", () =>
    expect(runCanBusTerminationResistance({ terminatorCount: 3 }).ok).toBe(
      false,
    ));
  it("rejects fractional terminator counts", () =>
    expect(runCanBusTerminationResistance({ terminatorCount: 1.5 }).ok).toBe(
      false,
    ));
});
