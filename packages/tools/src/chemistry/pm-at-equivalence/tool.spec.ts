import { describe, expect, it } from "vitest";
import { pmAtEquivalenceExample, runPmAtEquivalence } from "./tool.js";
describe("pM At Equivalence", () => {
  it("publishes an executable example", () =>
    expect(runPmAtEquivalence(pmAtEquivalenceExample.input)).toEqual({
      ok: true,
      output: pmAtEquivalenceExample.output,
    }));
  it("returns seven for Ksp of 1e-14", () =>
    expect(runPmAtEquivalence({ ksp: 1e-14 })).toEqual({
      ok: true,
      output: { pM: 7 },
    }));
  it("returns eight for Ksp of 1e-16", () =>
    expect(runPmAtEquivalence({ ksp: 1e-16 })).toEqual({
      ok: true,
      output: { pM: 8 },
    }));
  it("matches minus log of square root closely for silver chloride", () => {
    const result = runPmAtEquivalence({ ksp: 1.8e-10 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.pM).toBeCloseTo(4.872363747, 6);
  });
  it("returns four for Ksp of 1e-8", () =>
    expect(runPmAtEquivalence({ ksp: 1e-8 })).toEqual({
      ok: true,
      output: { pM: 4 },
    }));
  it("rejects zero Ksp", () =>
    expect(runPmAtEquivalence({ ksp: 0 }).ok).toBe(false));
  it("rejects negative Ksp", () =>
    expect(runPmAtEquivalence({ ksp: -1e-12 }).ok).toBe(false));
  it("rejects non-finite Ksp", () =>
    expect(runPmAtEquivalence({ ksp: Number.NaN }).ok).toBe(false));
});
