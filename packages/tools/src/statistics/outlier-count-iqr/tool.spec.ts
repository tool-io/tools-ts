import { describe, expect, it } from "vitest";
import { runOutlierCountIqr } from "./tool.js";

describe("Outlier Count IQR Tool", () => {
  it("counts values beyond the fences", () => {
    expect(
      runOutlierCountIqr({
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 100],
      }),
    ).toEqual({
      ok: true,
      output: { count: 1 },
    });
  });

  it("returns zero when nothing lies outside the fences", () => {
    expect(runOutlierCountIqr({ values: [1, 2, 3, 4, 5] })).toEqual({
      ok: true,
      output: { count: 0 },
    });
  });

  it("rejects invalid input", () =>
    expect(runOutlierCountIqr(null).ok).toBe(false));
});
