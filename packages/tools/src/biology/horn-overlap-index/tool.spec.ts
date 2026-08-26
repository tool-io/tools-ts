import { describe, expect, it } from "vitest";
import { hornOverlapIndexExample, runHornOverlapIndex } from "./tool.js";

describe("Morisita-Horn Overlap", () => {
  it("matches the canonical example", () => {
    expect(runHornOverlapIndex(hornOverlapIndexExample.input)).toEqual({
      ok: true,
      output: hornOverlapIndexExample.output,
    });
  });

  it("reports full overlap for identical distributions", () => {
    expect(
      runHornOverlapIndex({
        propA1: 0.6,
        propA2: 0.4,
        propB1: 0.6,
        propB2: 0.4,
      }),
    ).toEqual({ ok: true, output: { hornOverlapIndex: 1 } });
  });

  it("reports no overlap for disjoint distributions", () => {
    expect(
      runHornOverlapIndex({ propA1: 1, propA2: 0, propB1: 0, propB2: 1 }),
    ).toEqual({ ok: true, output: { hornOverlapIndex: 0 } });
  });

  it("uses proportional abundance rather than minimum shares", () => {
    const result = runHornOverlapIndex({
      propA1: 0.9,
      propA2: 0.1,
      propB1: 0.3,
      propB2: 0.7,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.hornOverlapIndex).toBeCloseTo(
        0.4857142857142857,
        12,
      );
  });

  it("rejects distributions that do not sum to one", () =>
    expect(
      runHornOverlapIndex({ propA1: 0, propA2: 0, propB1: 0.5, propB2: 0.5 })
        .ok,
    ).toBe(false));

  it("rejects proportions above one through the schema", () => {
    expect(
      runHornOverlapIndex({ propA1: 1.5, propA2: 0, propB1: 0.5, propB2: 0.5 })
        .ok,
    ).toBe(false);
    expect(
      runHornOverlapIndex({ propA1: 0.5, propA2: 0, propB1: 0.5, propB2: -0.5 })
        .ok,
    ).toBe(false);
  });

  it("rejects non finite proportions through the schema", () => {
    expect(
      runHornOverlapIndex({
        propA1: Number.POSITIVE_INFINITY,
        propA2: 0,
        propB1: 0.5,
        propB2: 0.5,
      }).ok,
    ).toBe(false);
  });
});
