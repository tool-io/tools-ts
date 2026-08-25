import { describe, expect, it } from "vitest";
import {
  brayCurtisDissimilarityExample,
  runBrayCurtisDissimilarity,
} from "./tool.js";

describe("Bray-Curtis Dissimilarity", () => {
  it("matches the canonical example", () => {
    expect(
      runBrayCurtisDissimilarity(brayCurtisDissimilarityExample.input),
    ).toEqual({ ok: true, output: brayCurtisDissimilarityExample.output });
  });

  it("reports zero dissimilarity for identical communities", () => {
    expect(runBrayCurtisDissimilarity({ a1: 7, a2: 3, b1: 7, b2: 3 })).toEqual({
      ok: true,
      output: { brayCurtisDissimilarity: 0 },
    });
  });

  it("reports full dissimilarity for disjoint communities", () => {
    expect(runBrayCurtisDissimilarity({ a1: 5, a2: 0, b1: 0, b2: 5 })).toEqual({
      ok: true,
      output: { brayCurtisDissimilarity: 1 },
    });
  });

  it("accepts fractional abundances symmetrically", () => {
    expect(
      runBrayCurtisDissimilarity({ a1: 2.5, a2: 0.5, b1: 0.5, b2: 2.5 }),
    ).toEqual({
      ok: true,
      output: { brayCurtisDissimilarity: 4 / 6 },
    });
  });

  it("rejects two empty communities with a stable code", () => {
    const result = runBrayCurtisDissimilarity({
      a1: 0,
      a2: 0,
      b1: 0,
      b2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "empty_samples",
        field: "a1",
      });
  });

  it("rejects negative abundances through the schema", () => {
    expect(runBrayCurtisDissimilarity({ a1: -1, a2: 2, b1: 1, b2: 1 }).ok).toBe(
      false,
    );
    expect(runBrayCurtisDissimilarity({ a1: 1, a2: 2, b1: 1, b2: -1 }).ok).toBe(
      false,
    );
  });

  it("rejects non finite abundances through the schema", () => {
    expect(
      runBrayCurtisDissimilarity({
        a1: Number.NaN,
        a2: 2,
        b1: 1,
        b2: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects non object input through the schema", () => {
    expect(runBrayCurtisDissimilarity(42).ok).toBe(false);
  });
});
