import { describe, expect, it } from "vitest";
import { runInbreedingPedigree } from "./tool.js";

describe("Pedigree Inbreeding Loop", () => {
  it("computes the contribution of a grandparent loop", () =>
    expect(runInbreedingPedigree({ generationsBackPath: 2 })).toEqual({
      ok: true,
      output: { inbreedingCoefficientPath: 0.125 },
    }));
  it("adds the common ancestor inbreeding term", () =>
    expect(
      runInbreedingPedigree({
        generationsBackPath: 2,
        parentalInbreedingF: 0.5,
      }),
    ).toEqual({ ok: true, output: { inbreedingCoefficientPath: 0.1875 } }));
  it("doubles for a fully inbred common ancestor", () =>
    expect(
      runInbreedingPedigree({
        generationsBackPath: 2,
        parentalInbreedingF: 1,
      }),
    ).toEqual({ ok: true, output: { inbreedingCoefficientPath: 0.25 } }));
  it("computes a parent loop", () =>
    expect(runInbreedingPedigree({ generationsBackPath: 1 })).toEqual({
      ok: true,
      output: { inbreedingCoefficientPath: 0.25 },
    }));
  it("shrinks for distant loops", () =>
    expect(runInbreedingPedigree({ generationsBackPath: 3 })).toEqual({
      ok: true,
      output: { inbreedingCoefficientPath: 0.0625 },
    }));
  it("rejects a zero loop path length", () => {
    const result = runInbreedingPedigree({ generationsBackPath: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_path");
  });
  it("rejects a negative loop path length", () => {
    const result = runInbreedingPedigree({ generationsBackPath: -1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_path");
  });
});
