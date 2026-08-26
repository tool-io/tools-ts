import { describe, expect, it } from "vitest";
import { mcintoshDiversityExample, runMcIntoshDiversity } from "./tool.js";

describe("McIntosh Index", () => {
  it("matches the canonical example", () => {
    expect(runMcIntoshDiversity(mcintoshDiversityExample.input)).toEqual({
      ok: true,
      output: mcintoshDiversityExample.output,
    });
  });

  it("reports zero diversity for a monoculture", () => {
    expect(runMcIntoshDiversity({ countA: 10, countB: 0, countC: 0 })).toEqual({
      ok: true,
      output: { mcintoshDiversity: 0 },
    });
  });

  it("reports maximal evenness across equal counts", () => {
    expect(runMcIntoshDiversity({ countA: 1, countB: 1, countC: 1 })).toEqual({
      ok: true,
      output: { mcintoshDiversity: 1 },
    });
  });

  it("handles a two species community", () => {
    expect(runMcIntoshDiversity({ countA: 3, countB: 1, countC: 0 })).toEqual({
      ok: true,
      output: { mcintoshDiversity: (4 - Math.sqrt(10)) / 2 },
    });
  });

  it("rejects an empty community with a stable code", () => {
    const result = runMcIntoshDiversity({ countA: 0, countB: 0, countC: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "insufficient_samples",
        field: "countA",
      });
  });
  it("rejects a one-individual community", () =>
    expect(runMcIntoshDiversity({ countA: 1, countB: 0, countC: 0 }).ok).toBe(
      false,
    ));

  it("rejects negative counts through the schema", () => {
    expect(runMcIntoshDiversity({ countA: -1, countB: 2, countC: 2 }).ok).toBe(
      false,
    );
    expect(runMcIntoshDiversity({ countA: 2, countB: -5, countC: 2 }).ok).toBe(
      false,
    );
    expect(runMcIntoshDiversity({ countA: 2, countB: 2, countC: -1 }).ok).toBe(
      false,
    );
  });

  it("rejects fractional counts through the schema", () => {
    expect(runMcIntoshDiversity({ countA: 1.5, countB: 2, countC: 2 }).ok).toBe(
      false,
    );
    expect(runMcIntoshDiversity({ countA: 1, countB: 2, countC: 0.5 }).ok).toBe(
      false,
    );
  });
});
