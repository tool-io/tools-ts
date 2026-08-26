import { describe, expect, it } from "vitest";
import { runMastitisRiskScore } from "./tool.js";

describe("Mastitis Risk Category", () => {
  it("classifies typical healthy counts as low", () =>
    expect(runMastitisRiskScore({ sccCellsMl: 150000 })).toEqual({
      ok: true,
      output: { riskCategory: "low" },
    }));
  it("classifies counts just below the moderate cut-off as low", () =>
    expect(runMastitisRiskScore({ sccCellsMl: 199999 })).toEqual({
      ok: true,
      output: { riskCategory: "low" },
    }));
  it("classifies the moderate cut-off itself as moderate", () =>
    expect(runMastitisRiskScore({ sccCellsMl: 200000 })).toEqual({
      ok: true,
      output: { riskCategory: "moderate" },
    }));
  it("classifies counts just below the high cut-off as moderate", () =>
    expect(runMastitisRiskScore({ sccCellsMl: 399999 })).toEqual({
      ok: true,
      output: { riskCategory: "moderate" },
    }));
  it("classifies the high cut-off and above as high", () =>
    expect(runMastitisRiskScore({ sccCellsMl: 400000 })).toEqual({
      ok: true,
      output: { riskCategory: "high" },
    }));
  it("classifies zero cells per millilitre as low", () =>
    expect(runMastitisRiskScore({ sccCellsMl: 0 })).toEqual({
      ok: true,
      output: { riskCategory: "low" },
    }));
  it("rejects negative cell counts", () =>
    expect(runMastitisRiskScore({ sccCellsMl: -1 }).ok).toBe(false));
});
