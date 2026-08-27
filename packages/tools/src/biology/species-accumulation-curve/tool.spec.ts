import { describe, expect, it } from "vitest";
import {
  runSpeciesAccumulationCurve,
  speciesAccumulationCurveExample,
} from "./tool.js";

describe("Accumulation Slope Segment", () => {
  it("publishes an executable example", () =>
    expect(
      runSpeciesAccumulationCurve(speciesAccumulationCurveExample.input),
    ).toEqual({ ok: true, output: speciesAccumulationCurveExample.output }));
  it("returns zero when no new species appear", () =>
    expect(
      runSpeciesAccumulationCurve({
        effortUnits: 4,
        speciesAfterInt: 30,
        speciesBeforeInt: 30,
      }),
    ).toEqual({ ok: true, output: { accumulationRate: 0 } }));
  it("handles a single unit of effort", () =>
    expect(
      runSpeciesAccumulationCurve({
        effortUnits: 1,
        speciesAfterInt: 8,
        speciesBeforeInt: 5,
      }),
    ).toEqual({ ok: true, output: { accumulationRate: 3 } }));
  it("starts from zero baseline species", () =>
    expect(
      runSpeciesAccumulationCurve({
        effortUnits: 2,
        speciesAfterInt: 9,
        speciesBeforeInt: 0,
      }),
    ).toEqual({ ok: true, output: { accumulationRate: 4.5 } }));
  it("keeps fractional rates", () =>
    expect(
      runSpeciesAccumulationCurve({
        effortUnits: 3,
        speciesAfterInt: 10,
        speciesBeforeInt: 1,
      }),
    ).toEqual({ ok: true, output: { accumulationRate: 3 } }));
  it("rejects non-positive effort", () => {
    const result = runSpeciesAccumulationCurve({
      effortUnits: 0,
      speciesAfterInt: 10,
      speciesBeforeInt: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("effortUnits");
  });
  it("rejects decreasing counts", () => {
    const result = runSpeciesAccumulationCurve({
      effortUnits: 2,
      speciesAfterInt: 4,
      speciesBeforeInt: 7,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("decreasing_curve");
  });
  it("rejects negative counts", () => {
    const result = runSpeciesAccumulationCurve({
      effortUnits: 2,
      speciesAfterInt: -1,
      speciesBeforeInt: 0,
    });
    expect(result.ok).toBe(false);
  });
});
