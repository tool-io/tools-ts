import { describe, expect, it } from "vitest";
import { runBoilingPointClausiusClapeyron } from "./tool.js";
describe("Boiling Point Clausius-Clapeyron Calculator", () => {
  it("returns T1 when P1 equals P2", () => {
    const r = runBoilingPointClausiusClapeyron({
      deltaHVapCalMol: 9720,
      pressure1: 760,
      pressure2: 760,
      temperature1K: 373,
    });
    if (!r.ok) throw new Error("fail");
    expect(r.output.boilingPointK).toBeCloseTo(373, 0);
  });
  it("rejects invalid input", () =>
    expect(runBoilingPointClausiusClapeyron(null).ok).toBe(false));
});
