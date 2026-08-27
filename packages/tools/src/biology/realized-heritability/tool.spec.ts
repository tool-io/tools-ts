import { describe, expect, it } from "vitest";
import { runRealizedHeritability } from "./tool.js";

describe("Realized Heritability", () => {
  it("calculates a valid result", () =>
    expect(
      runRealizedHeritability({ responseR: 4.8, selectionDifferenceS: 12 }),
    ).toEqual({
      ok: true,
      output: { realizedHeritability: 0.39999999999999997 },
    }));
  it("returns one half for equal-magnitude inputs", () =>
    expect(
      runRealizedHeritability({ responseR: 5, selectionDifferenceS: 10 }),
    ).toEqual({
      ok: true,
      output: { realizedHeritability: 0.5 },
    }));
  it("keeps the sign of opposing response and selection", () =>
    expect(
      runRealizedHeritability({ responseR: -3, selectionDifferenceS: -6 }),
    ).toEqual({
      ok: true,
      output: { realizedHeritability: 0.5 },
    }));
  it("yields a negative value when response opposes selection", () =>
    expect(
      runRealizedHeritability({ responseR: -2, selectionDifferenceS: 8 }),
    ).toEqual({
      ok: true,
      output: { realizedHeritability: -0.25 },
    }));
  it("returns zero with no response", () =>
    expect(
      runRealizedHeritability({ responseR: 0, selectionDifferenceS: 10 }),
    ).toEqual({
      ok: true,
      output: { realizedHeritability: 0 },
    }));
  it("rejects a zero selection difference", () => {
    const result = runRealizedHeritability({
      responseR: 4.8,
      selectionDifferenceS: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_selection");
  });
});
