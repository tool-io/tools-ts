import { describe, expect, it } from "vitest";
import { runSolubilityFromKsp, solubilityFromKspExample } from "./tool.js";
describe("Solubility From Ksp", () => {
  it("publishes an executable example", () =>
    expect(runSolubilityFromKsp(solubilityFromKspExample.input)).toEqual({
      ok: true,
      output: solubilityFromKspExample.output,
    }));
  it("defaults to the AB form when omitted", () =>
    expect(runSolubilityFromKsp({ ksp: 1e-10 })).toEqual({
      ok: true,
      output: { molarSolubility: 0.00001 },
    }));
  it("solves AB2 salts through a cube root", () => {
    const result = runSolubilityFromKsp({ form: "ab2", ksp: 4e-12 });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.molarSolubility).toBeCloseTo(0.0001, 15);
  });
  it("grows with larger Ksp values", () => {
    const small = runSolubilityFromKsp({ ksp: 1e-12 });
    const large = runSolubilityFromKsp({ ksp: 1e-8 });
    expect(small.ok).toBe(true);
    expect(large.ok).toBe(true);
    if (small.ok && large.ok)
      expect(Number(large.output.molarSolubility)).toBeGreaterThan(
        Number(small.output.molarSolubility),
      );
  });
  it("rejects zero Ksp", () =>
    expect(runSolubilityFromKsp({ ksp: 0 }).ok).toBe(false));
  it("rejects negative Ksp", () =>
    expect(runSolubilityFromKsp({ ksp: -1e-10 }).ok).toBe(false));
  it("rejects unsupported salt forms", () =>
    expect(runSolubilityFromKsp({ form: "ab3", ksp: 1e-10 }).ok).toBe(false));
  it("rejects missing Ksp", () =>
    expect(runSolubilityFromKsp({}).ok).toBe(false));
});
