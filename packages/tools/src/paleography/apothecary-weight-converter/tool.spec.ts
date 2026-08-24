import { describe, expect, it } from "vitest";
import {
  apothecaryWeightConverterExample,
  runApothecaryWeightConverter,
} from "./tool.js";

describe("apothecary-weight-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runApothecaryWeightConverter(apothecaryWeightConverterExample.input),
    ).toEqual({ ok: true, output: apothecaryWeightConverterExample.output });
  });

  it("converts one apothecary pound to grains and grams", () => {
    expect(runApothecaryWeightConverter({ amount: 1, unit: "pound" })).toEqual({
      ok: true,
      output: {
        totalGrains: 5760,
        grams: 373.2417216,
        totalScruples: 288,
        totalOunces: 12,
      },
    });
  });

  it("rejects non-positive amounts", () => {
    expect(
      runApothecaryWeightConverter({ amount: 0, unit: "scruple" }).ok,
    ).toBe(false);
  });
});
