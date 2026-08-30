import { describe, expect, it } from "vitest";
import {
  controlDeficiencyWaterfallExample,
  runControlDeficiencyWaterfall,
  summarizeControlDeficiencies,
} from "./tool.js";

describe("control deficiency severity waterfall", () => {
  it("reproduces its canonical example", () => {
    expect(
      runControlDeficiencyWaterfall(controlDeficiencyWaterfallExample.input),
    ).toEqual({
      ok: true,
      output: controlDeficiencyWaterfallExample.output,
    });
  });

  it("selects the highest severity regardless of input order", () => {
    expect(
      summarizeControlDeficiencies({
        deficiencies: [
          [3, 1],
          [1, 2],
        ],
      }).highestSeverity,
    ).toBe("material_weakness");
  });

  it("returns none for an empty population", () => {
    expect(summarizeControlDeficiencies({ deficiencies: [] })).toEqual({
      highestSeverity: "none",
      severeDeficiencyCount: 0,
      totalAmount: 0,
    });
  });

  it("rejects an unsupported severity code", () => {
    expect(
      runControlDeficiencyWaterfall({ deficiencies: [[4, 100]] }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_deficiency_severity", field: "deficiencies.0.0" },
        ],
      },
      ok: false,
    });
  });
});
