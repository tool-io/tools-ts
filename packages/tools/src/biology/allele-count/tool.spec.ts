import { describe, expect, it } from "vitest";
import { alleleCountExample, runAlleleCount } from "./tool.js";

describe("Allele Count Total", () => {
  it("matches the canonical example", () => {
    expect(runAlleleCount(alleleCountExample.input)).toEqual({
      ok: true,
      output: alleleCountExample.output,
    });
  });
  it("doubles one individual", () =>
    expect(runAlleleCount({ individuals: 1 })).toEqual({
      ok: true,
      output: { alleleCopies: 2 },
    }));
  it("returns zero for an empty sample", () =>
    expect(runAlleleCount({ individuals: 0 })).toEqual({
      ok: true,
      output: { alleleCopies: 0 },
    }));
  it("doubles a large sample", () =>
    expect(runAlleleCount({ individuals: 1234567 })).toEqual({
      ok: true,
      output: { alleleCopies: 2469134 },
    }));
  it("rejects negative counts", () =>
    expect(runAlleleCount({ individuals: -2 }).ok).toBe(false));
  it("rejects fractional individuals", () =>
    expect(runAlleleCount({ individuals: 1.5 }).ok).toBe(false));
});
