import { describe, expect, it } from "vitest";
import { runWeakBasePh, weakBasePhExample } from "./tool.js";
describe("Weak Base pH", () => {
  it("publishes an executable example", () =>
    expect(runWeakBasePh(weakBasePhExample.input)).toEqual({
      ok: true,
      output: weakBasePhExample.output,
    }));
  it("raises pH for a stronger base at fixed concentration", () => {
    const result = runWeakBasePh({ concM: 0.1, kb: 1.8e-4 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeGreaterThan(11.127636252551653);
  });
  it("stays below fourteen for realistic ammonia values", () => {
    const result = runWeakBasePh({ concM: 1, kb: 1.8e-5 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeLessThan(14);
  });
  it("mirrors the conjugate acid pKa of a weak acid pair", () => {
    const result = runWeakBasePh({ concM: 0.01, kb: 1.8e-5 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ph).toBeCloseTo(10.61842416617449, 12);
  });
  it("rejects zero Kb", () =>
    expect(runWeakBasePh({ concM: 0.1, kb: 0 }).ok).toBe(false));
  it("rejects zero concentration", () =>
    expect(runWeakBasePh({ concM: 0, kb: 1.8e-5 }).ok).toBe(false));
  it("rejects negative concentration", () =>
    expect(runWeakBasePh({ concM: -0.5, kb: 1.8e-5 }).ok).toBe(false));
});
