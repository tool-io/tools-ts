import { describe, expect, it } from "vitest";
import { runDewpointFromVaporPressure } from "./tool.js";
describe("Dewpoint From Vapor Pressure", () => {
  it("calculates a valid result", () =>
    expect(runDewpointFromVaporPressure({ vaporPressureHpa: 20 })).toEqual({
      ok: true,
      output: { dewpointCelsius: 17.525973740891686 },
    }));
  it("rejects invalid input", () =>
    expect(runDewpointFromVaporPressure({ vaporPressureHpa: 0 }).ok).toBe(
      false,
    ));
});
