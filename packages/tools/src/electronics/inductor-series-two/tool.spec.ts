import { describe, expect, it } from "vitest";
import { runInductorSeriesTwo } from "./tool.js";
describe("Series Inductors", () => {
  it("calculates a valid result", () =>
    expect(runInductorSeriesTwo({ l1H: 0.002, l2H: 0.003 })).toEqual({
      ok: true,
      output: { totalInductanceH: 0.005 },
    }));
  it("sums other values exactly", () =>
    expect(runInductorSeriesTwo({ l1H: 0.05, l2H: 0.02 })).toEqual({
      ok: true,
      output: { totalInductanceH: 0.07 },
    }));
  it("allows zero inductances", () =>
    expect(runInductorSeriesTwo({ l1H: 0, l2H: 5 })).toEqual({
      ok: true,
      output: { totalInductanceH: 5 },
    }));
  it("sums signed inductances", () =>
    expect(runInductorSeriesTwo({ l1H: -1, l2H: 1 })).toEqual({
      ok: true,
      output: { totalInductanceH: 0 },
    }));
  it("rejects non-finite input", () =>
    expect(
      runInductorSeriesTwo({ l1H: Number.POSITIVE_INFINITY, l2H: 1 }).ok,
    ).toBe(false));
  it("rejects an unknown field", () => {
    const result = runInductorSeriesTwo({ l1H: 1, l2H: 2, extra: 3 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "extra",
      });
  });
  it("rejects missing required input", () =>
    expect(runInductorSeriesTwo({ l1H: 1 }).ok).toBe(false));
  it("rejects non-numeric input", () =>
    expect(runInductorSeriesTwo({ l1H: "1", l2H: 2 }).ok).toBe(false));
});
