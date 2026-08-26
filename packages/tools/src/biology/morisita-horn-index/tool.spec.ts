import { describe, expect, it } from "vitest";
import { morisitaHornIndexExample, runMorisitaHornIndex } from "./tool.js";

describe("Morisita-Horn Counts", () => {
  it("matches the canonical example", () => {
    expect(runMorisitaHornIndex(morisitaHornIndexExample.input)).toEqual({
      ok: true,
      output: morisitaHornIndexExample.output,
    });
  });

  it("reports full overlap for identical communities", () => {
    expect(runMorisitaHornIndex({ a1: 5, a2: 3, b1: 5, b2: 3 })).toEqual({
      ok: true,
      output: { morisitaHornIndex: 1 },
    });
  });

  it("reports no overlap for disjoint communities", () => {
    expect(runMorisitaHornIndex({ a1: 8, a2: 0, b1: 0, b2: 7 })).toEqual({
      ok: true,
      output: { morisitaHornIndex: 0 },
    });
  });

  it("ignores shared absence of a species", () => {
    expect(runMorisitaHornIndex({ a1: 6, a2: 0, b1: 6, b2: 0 })).toEqual({
      ok: true,
      output: { morisitaHornIndex: 1 },
    });
  });

  it("rejects two empty communities with a stable code", () => {
    const result = runMorisitaHornIndex({ a1: 0, a2: 0, b1: 0, b2: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "empty_samples",
        field: "a1",
      });
  });
  it("rejects either empty community", () => {
    expect(runMorisitaHornIndex({ a1: 1, a2: 2, b1: 0, b2: 0 }).ok).toBe(false);
  });

  it("rejects negative counts through the schema", () => {
    expect(runMorisitaHornIndex({ a1: -1, a2: 2, b1: 2, b2: 2 }).ok).toBe(
      false,
    );
    expect(runMorisitaHornIndex({ a1: 2, a2: 2, b1: -2, b2: 2 }).ok).toBe(
      false,
    );
  });

  it("rejects fractional counts through the schema", () => {
    expect(runMorisitaHornIndex({ a1: 1.5, a2: 2, b1: 2, b2: 2 }).ok).toBe(
      false,
    );
    expect(runMorisitaHornIndex({ a1: 2, a2: 2, b1: 2, b2: 2.25 }).ok).toBe(
      false,
    );
  });

  it("rejects non object input and missing fields through the schema", () => {
    expect(runMorisitaHornIndex(null).ok).toBe(false);
    expect(runMorisitaHornIndex({ a1: 1, a2: 1, b1: 1 }).ok).toBe(false);
  });
});
