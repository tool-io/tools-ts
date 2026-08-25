import { describe, expect, it } from "vitest";
import { brillouinDiversityExample, runBrillouinDiversity } from "./tool.js";

describe("Brillouin Index", () => {
  it("publishes an executable example", () =>
    expect(runBrillouinDiversity(brillouinDiversityExample.input)).toEqual({
      ok: true,
      output: brillouinDiversityExample.output,
    }));
  it("calculates a mixed three-species community", () =>
    expect(runBrillouinDiversity({ countA: 2, countB: 3, countC: 1 })).toEqual({
      ok: true,
      output: { brillouinIndex: 0.6823907603703502 },
    }));
  it("is order independent", () =>
    expect(runBrillouinDiversity({ countA: 1, countB: 2, countC: 3 })).toEqual({
      ok: true,
      output: { brillouinIndex: 0.6823907603703502 },
    }));
  it("is zero for a single species community", () =>
    expect(runBrillouinDiversity({ countA: 25, countB: 0, countC: 0 })).toEqual(
      { ok: true, output: { brillouinIndex: 0 } },
    ));
  it("rejects an empty community", () => {
    const result = runBrillouinDiversity({
      countA: 0,
      countB: 0,
      countC: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_community");
  });
  it("rejects communities beyond the factorial limit", () => {
    const result = runBrillouinDiversity({
      countA: 6000,
      countB: 4000,
      countC: 500,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("community_too_large");
  });
  it("accepts a community at the factorial limit", () =>
    expect(
      runBrillouinDiversity({ countA: 10000, countB: 0, countC: 0 }).ok,
    ).toBe(true));
  it("rejects fractional counts", () =>
    expect(
      runBrillouinDiversity({ countA: 1.5, countB: 0, countC: 0 }).ok,
    ).toBe(false));
});
