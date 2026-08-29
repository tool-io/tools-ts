import { describe, expect, it } from "vitest";
import { runVaporPressureFromDewpoint } from "./tool.js";
describe("Vapor Pressure From Dewpoint", () => {
  it("calculates a valid result", () =>
    expect(runVaporPressureFromDewpoint({ temperatureC: 20 })).toEqual({
      ok: true,
      output: { vaporPressureHpa: 23.344336740732764 },
    }));
  it("rejects invalid input", () =>
    expect(runVaporPressureFromDewpoint({ temperatureC: 61 }).ok).toBe(false));
});
