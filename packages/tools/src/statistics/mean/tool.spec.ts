import { describe, expect, it } from "vitest";
import { meanExample, runMean } from "./tool.js";

describe("Mean Calculator", () => {
  it("calculates the arithmetic mean", () =>
    expect(runMean({ values: [-2, 3, 8] })).toEqual({
      ok: true,
      output: { mean: 3 },
    }));

  it("rejects an empty list", () =>
    expect(runMean({ values: [] }).ok).toBe(false));

  it("publishes an executable authored example", () => {
    expect(runMean(meanExample.input)).toEqual({
      ok: true,
      output: meanExample.output,
    });
  });
});
