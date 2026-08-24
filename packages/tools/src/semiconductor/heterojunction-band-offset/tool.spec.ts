import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateHeterojunctionBandOffset,
  heterojunctionBandOffsetExample,
  runHeterojunctionBandOffset,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("Heterojunction Band Offset Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHeterojunctionBandOffset(heterojunctionBandOffsetExample.input),
    ).toEqual({ ok: true, output: heterojunctionBandOffsetExample.output });
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(heterojunctionBandOffsetExample),
    ) as typeof heterojunctionBandOffsetExample;
    expect(roundTrip).toEqual(heterojunctionBandOffsetExample);
  });

  it("uses the default 65/35 empirical partition", () => {
    const { conductionBandOffsetEv, valenceBandOffsetEv } =
      calculateHeterojunctionBandOffset({ bandgapDifferenceEv: 2 });
    expect(conductionBandOffsetEv).toBeCloseTo(1.3, 12);
    expect(valenceBandOffsetEv).toBeCloseTo(0.7, 12);
  });

  it("uses a supplied material-specific conduction-band fraction", () => {
    expect(
      calculateHeterojunctionBandOffset({
        bandgapDifferenceEv: 2,
        conductionBandOffsetFraction: 0.4,
      }),
    ).toEqual({ conductionBandOffsetEv: 0.8, valenceBandOffsetEv: 1.2 });
  });

  it("offsets sum back to the bandgap difference", () => {
    const { conductionBandOffsetEv, valenceBandOffsetEv } =
      calculateHeterojunctionBandOffset({ bandgapDifferenceEv: 1.24 });
    expect(conductionBandOffsetEv + valenceBandOffsetEv).toBe(1.24);
  });

  it("keeps both offsets positive for small gaps", () => {
    const { conductionBandOffsetEv, valenceBandOffsetEv } =
      calculateHeterojunctionBandOffset({ bandgapDifferenceEv: 0.01 });
    expect(conductionBandOffsetEv).toBeGreaterThan(0);
    expect(valenceBandOffsetEv).toBeGreaterThan(0);
  });

  it("grows linearly with the bandgap difference", () => {
    const small = calculateHeterojunctionBandOffset({
      bandgapDifferenceEv: 0.5,
    }).conductionBandOffsetEv;
    const large = calculateHeterojunctionBandOffset({
      bandgapDifferenceEv: 1.5,
    }).conductionBandOffsetEv;
    expect(large).toBeCloseTo(3 * small, 12);
  });

  it("rejects zero and negative bandgap differences", () => {
    for (const bad of [0, -0.4]) {
      const error = errorOf(
        runHeterojunctionBandOffset({ bandgapDifferenceEv: bad }),
      );
      expect(error.code).toBe("invalid_input");
      expect(error.issues[0].code).toBe("invalid_field");
      expect(error.issues[0].field).toBe("bandgapDifferenceEv");
    }
  });

  it("rejects offset fractions at and outside either boundary", () => {
    for (const conductionBandOffsetFraction of [0, 1, -0.1, 1.1]) {
      const error = errorOf(
        runHeterojunctionBandOffset({
          bandgapDifferenceEv: 1,
          conductionBandOffsetFraction,
        }),
      );
      expect(error.issues[0].field).toBe("conductionBandOffsetFraction");
    }
  });

  it("rejects NaN through validation", () => {
    const error = errorOf(
      runHeterojunctionBandOffset({
        bandgapDifferenceEv: Number.NaN,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
  });

  it("rejects missing required input", () => {
    const error = errorOf(runHeterojunctionBandOffset({}));
    expect(error.code).toBe("invalid_input");
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runHeterojunctionBandOffset({
        bandgapDifferenceEv: 1.24,
        material: "GaAs",
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const error = errorOf(runHeterojunctionBandOffset([1.24]));
    expect(error.issues[0].code).toBe("object_required");
  });
});
