import { describe, expect, it } from "vitest";
import { runVaporPressureClausiusClapeyron } from "./tool.js";
describe("Vapor Pressure Clausius-Clapeyron Calculator", () => {
  it("returns P1 when T1 equals T2", () => {
    const r = runVaporPressureClausiusClapeyron({
      deltaHVapCalMol: 9720,
      pressure1: 760,
      temperature1K: 373,
      temperature2K: 373,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.pressure2).toBeCloseTo(760, 0);
  });
  it("rejects invalid input", () =>
    expect(runVaporPressureClausiusClapeyron(null).ok).toBe(false));
});
