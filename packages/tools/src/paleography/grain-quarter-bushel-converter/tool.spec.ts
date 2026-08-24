import { describe, expect, it } from "vitest";
import {
  grainQuarterBushelConverterExample,
  runGrainQuarterBushelConverter,
} from "./tool.js";

describe("grain-quarter-bushel-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runGrainQuarterBushelConverter(grainQuarterBushelConverterExample.input),
    ).toEqual({ ok: true, output: grainQuarterBushelConverterExample.output });
  });

  it("converts five and a half bushels down to pecks and gallons", () => {
    expect(
      runGrainQuarterBushelConverter({ amount: 5.5, unit: "bushel" }),
    ).toEqual({
      ok: true,
      output: {
        quarters: 0.6875,
        bushels: 5.5,
        pecks: 22,
        dryGallons: 44,
      },
    });
  });

  it("rejects non-positive amounts", () => {
    expect(
      runGrainQuarterBushelConverter({ amount: -1, unit: "peck" }).ok,
    ).toBe(false);
  });

  it("rejects conversions that overflow", () => {
    expect(
      runGrainQuarterBushelConverter({
        amount: Number.MAX_VALUE,
        unit: "quarter",
      }).ok,
    ).toBe(false);
  });
});
