import { describe, expect, it } from "vitest";
import {
  seriesResistanceExample,
  calculateSeriesResistance,
  runSeriesResistance,
} from "./tool.js";

describe("electricity/series-resistance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSeriesResistance(seriesResistanceExample.input)).toEqual({
      ok: true,
      output: seriesResistanceExample.output,
    });
  });
  it("rejects invalid input (insufficient_resistances)", () => {
    expect(runSeriesResistance({ resistancesOhms: [] }).ok).toBe(false);
  });
  it("rejects invalid input (invalid_resistance)", () => {
    expect(runSeriesResistance({ resistancesOhms: [10, 0] }).ok).toBe(false);
  });
});
