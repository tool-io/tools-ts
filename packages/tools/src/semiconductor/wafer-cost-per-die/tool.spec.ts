import { describe, expect, it } from "vitest";
import { runWaferCostPerDie, waferCostPerDieExample } from "./tool.js";

describe("wafer cost per good die", () => {
  it("reproduces the documented edge-loss example", () =>
    expect(runWaferCostPerDie(waferCostPerDieExample.input)).toEqual({
      ok: true,
      output: waferCostPerDieExample.output,
    }));
  it("increases cost when yield falls", () => {
    const result = runWaferCostPerDie({
      ...waferCostPerDieExample.input,
      dieYieldPercent: 40,
    });
    expect(result.ok && result.output.costPerGoodDieEur).toBeCloseTo(
      2 * waferCostPerDieExample.output.costPerGoodDieEur,
      12,
    );
  });
  it("rejects dies too large for the usable wafer", () =>
    expect(
      runWaferCostPerDie({
        ...waferCostPerDieExample.input,
        dieHeightMm: 500,
        dieWidthMm: 500,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "no_complete_dies" }] },
    }));
});
