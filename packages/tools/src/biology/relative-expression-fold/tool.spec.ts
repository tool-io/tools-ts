import { describe, expect, it } from "vitest";
import { runRelativeExpressionFold } from "./tool.js";

describe("Relative Expression Fold", () => {
  it("calculates a valid result", () =>
    expect(runRelativeExpressionFold({ ddCt: -2 })).toEqual({
      ok: true,
      output: { relativeFoldChange: 4 },
    }));
  it("returns one at unchanged expression", () =>
    expect(runRelativeExpressionFold({ ddCt: 0 })).toEqual({
      ok: true,
      output: { relativeFoldChange: 1 },
    }));
  it("halves expression per positive delta delta CT", () =>
    expect(runRelativeExpressionFold({ ddCt: 1 })).toEqual({
      ok: true,
      output: { relativeFoldChange: 0.5 },
    }));
  it("scales down with larger positive deltas", () =>
    expect(runRelativeExpressionFold({ ddCt: 3 })).toEqual({
      ok: true,
      output: { relativeFoldChange: 0.125 },
    }));
  it("rejects non-finite input", () =>
    expect(runRelativeExpressionFold({ ddCt: Number.NaN }).ok).toBe(false));
});
