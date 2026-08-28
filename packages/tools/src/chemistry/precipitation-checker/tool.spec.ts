import { describe, expect, it } from "vitest";
import { runPrecipitationChecker } from "./tool.js";
describe("Precipitation Checker", () => {
  it("calculates a valid result", () =>
    expect(
      runPrecipitationChecker({ metalIonM: 0.001, anionM: 0.001, ksp: 1e-10 }),
    ).toEqual({
      ok: true,
      output: { willPrecipitate: true, ionProductQ: 0.000001 },
    }));
  it("reports no precipitation when Q is below Ksp", () =>
    expect(
      runPrecipitationChecker({ metalIonM: 1e-6, anionM: 1e-6, ksp: 1e-10 }).ok,
    ).toBe(true));
  it("rejects invalid input", () =>
    expect(
      runPrecipitationChecker({ metalIonM: -1, anionM: 0.001, ksp: 1e-10 }).ok,
    ).toBe(false));
});
