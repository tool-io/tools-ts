import { describe, expect, it } from "vitest";
import { barSmileBudgetExample as example, runBarSmileBudget } from "./tool.js";
describe("bar smile pointing budget", () => {
  it("keeps microradian-to-millimeter units consistent", () =>
    expect(runBarSmileBudget(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("moves 0.1 mm at 1000 mm for 100 µrad", () =>
    expect(
      runBarSmileBudget({
        allowedPointingUrad: 100,
        collimatorFocalLengthMm: 20,
        smileUm: 2,
        workingDistanceMm: 1000,
      }),
    ).toEqual({
      ok: true,
      output: { pointingUrad: 100, spotShiftMm: 0.1, withinBudget: true },
    }));
});
