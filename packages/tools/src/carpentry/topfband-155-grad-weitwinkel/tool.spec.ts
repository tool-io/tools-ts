import { describe, expect, it } from "vitest";
import {
  hingeCupPatternExample,
  hingeCupPatternTool,
  runHingeCupPattern,
} from "./tool.js";

describe("155 Degree Hinge Cup Pattern", () => {
  it("computes the canonical example", () =>
    expect(runHingeCupPattern(hingeCupPatternExample.input)).toEqual({
      ok: true,
      output: {
        cupDiameterMm: 35,
        openingAngleDegrees: 155,
        minimumStileWidthMm: 42,
      },
    }));

  it("applies the default 3.5 mm edge distance when omitted", () =>
    expect(runHingeCupPattern({})).toEqual({
      ok: true,
      output: {
        cupDiameterMm: 35,
        openingAngleDegrees: 155,
        minimumStileWidthMm: 42,
      },
    }));

  it.each([
    [3, 41],
    [5, 45],
    [7, 49],
  ])(
    "adds twice the %p mm edge distance to the 35 mm cup",
    (edgeDistanceMm, expected) =>
      expect(runHingeCupPattern({ edgeDistanceMm })).toEqual({
        ok: true,
        output: {
          cupDiameterMm: 35,
          openingAngleDegrees: 155,
          minimumStileWidthMm: expected,
        },
      }),
  );

  it("rejects an edge distance below 3 mm", () => {
    const result = runHingeCupPattern({ edgeDistanceMm: 2.9 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects an edge distance above 7 mm", () =>
    expect(runHingeCupPattern({ edgeDistanceMm: 7.5 }).ok).toBe(false));

  it("rejects non-numeric and non-finite edge distances", () => {
    expect(runHingeCupPattern({ edgeDistanceMm: "4" } as never).ok).toBe(false);
    expect(runHingeCupPattern({ edgeDistanceMm: Number.NaN }).ok).toBe(false);
    expect(
      runHingeCupPattern({ edgeDistanceMm: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () => {
    const result = runHingeCupPattern({
      edgeDistanceMm: 4,
      cupDiameterMm: 35,
    } as never);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("publishes a serializable and executable example", () => {
    expect(JSON.parse(JSON.stringify(hingeCupPatternExample))).toEqual(
      hingeCupPatternExample,
    );
    expect(hingeCupPatternTool.id).toBe(
      "carpentry/topfband-155-grad-weitwinkel",
    );
    expect(hingeCupPatternTool.execution).toEqual({ kind: "pure" });
  });
});
