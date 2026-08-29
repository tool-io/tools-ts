import { describe, expect, it } from "vitest";
import { runWeakAcidPh, weakAcidPhExample } from "./tool.js";
describe("Weak Acid pH", () => {
  it("publishes an executable example", () =>
    expect(runWeakAcidPh(weakAcidPhExample.input)).toEqual({
      ok: true,
      output: weakAcidPhExample.output,
    }));
  it("solves the equilibrium when Ka equals the formal concentration", () => {
    const result = runWeakAcidPh({ concM: 0.01, ka: 0.01 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeCloseTo(2.208987640249979, 12);
  });
  it("raises pH by half a unit when Ka drops tenfold", () => {
    const strongResult = runWeakAcidPh({ concM: 0.1, ka: 1e-4 });
    const weakResult = runWeakAcidPh({ concM: 0.1, ka: 1e-5 });
    expect(strongResult.ok).toBe(true);
    expect(weakResult.ok).toBe(true);
    if (strongResult.ok && weakResult.ok)
      expect(
        Number(weakResult.output.ph) - Number(strongResult.output.ph),
      ).toBeCloseTo(0.4953049507559597, 12);
  });
  it("matches acetic acid at room temperature closely", () => {
    const result = runWeakAcidPh({ concM: 0.1, ka: 1.8e-5 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeCloseTo(2.8752770615501357, 12);
  });
  it("rejects zero Ka", () =>
    expect(runWeakAcidPh({ concM: 0.1, ka: 0 }).ok).toBe(false));
  it("rejects zero concentration", () =>
    expect(runWeakAcidPh({ concM: 0, ka: 1e-5 }).ok).toBe(false));
  it("rejects negative concentration", () =>
    expect(runWeakAcidPh({ concM: -0.1, ka: 1e-5 }).ok).toBe(false));
});
