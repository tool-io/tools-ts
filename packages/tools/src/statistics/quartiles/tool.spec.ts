import { describe, expect, it } from "vitest";
import { calculateQuartiles, quartilesExample, runQuartiles } from "./tool.js";

describe("Quartiles Calculator", () => {
  it("uses inclusive quartiles", () => {
    expect(calculateQuartiles([5, 1, 3, 2, 4])).toEqual([2, 3, 4]);
    expect(calculateQuartiles([])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runQuartiles(quartilesExample.input)).toEqual({
      ok: true,
      output: quartilesExample.output,
    }));
});
