import { describe, expect, it } from "vitest";
import type { ToolResult } from "../../core/result.js";
import {
  calculateFinfetFinHeightEffect,
  finfetFinHeightEffectExample,
  runFinfetFinHeightEffect,
} from "./tool.js";

const errorOf = <T>(result: ToolResult<T>) => {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Expected the execution to fail.");
  return result.error;
};

describe("FinFET Effective Width Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFinfetFinHeightEffect(finfetFinHeightEffectExample.input),
    ).toEqual({
      ok: true,
      output: finfetFinHeightEffectExample.output,
    });
  });

  it("canonical example survives a JSON round trip", () => {
    const roundTrip = JSON.parse(
      JSON.stringify(finfetFinHeightEffectExample),
    ) as typeof finfetFinHeightEffectExample;
    expect(roundTrip).toEqual(finfetFinHeightEffectExample);
  });

  it("counts both vertical sidewalls plus the fin top", () => {
    expect(
      calculateFinfetFinHeightEffect({
        finHeightNm: 50,
        finWidthNm: 5,
        layoutWidthNm: 105,
      }),
    ).toEqual({ effectiveWidthNm: 105, effectiveWidthRatio: 1 });
  });

  it("scales effective width linearly with fin height", () => {
    const low = calculateFinfetFinHeightEffect({
      finHeightNm: 10,
      finWidthNm: 8,
      layoutWidthNm: 100,
    }).effectiveWidthNm;
    const high = calculateFinfetFinHeightEffect({
      finHeightNm: 20,
      finWidthNm: 8,
      layoutWidthNm: 100,
    }).effectiveWidthNm;
    expect(high - low).toBe(20);
  });

  it("keeps the ratio at one when geometry matches the layout width", () => {
    expect(
      calculateFinfetFinHeightEffect({
        finHeightNm: 30,
        finWidthNm: 40,
        layoutWidthNm: 100,
      }),
    ).toEqual({ effectiveWidthNm: 100, effectiveWidthRatio: 1 });
  });

  it("rejects zero fin height", () => {
    const error = errorOf(
      runFinfetFinHeightEffect({
        finHeightNm: 0,
        finWidthNm: 10,
        layoutWidthNm: 20,
      }),
    );
    expect(error.code).toBe("invalid_input");
    expect(error.issues[0].code).toBe("invalid_field");
    expect(error.issues[0].field).toBe("finHeightNm");
  });

  it("rejects negative fin width and non-positive layout width", () => {
    for (const bad of [
      { finHeightNm: 5, finWidthNm: -1, layoutWidthNm: 20 },
      { finHeightNm: 5, finWidthNm: 10, layoutWidthNm: 0 },
    ]) {
      const error = errorOf(runFinfetFinHeightEffect(bad));
      expect(error.issues[0].code).toBe("invalid_field");
    }
  });

  it("rejects NaN through validation", () => {
    const error = errorOf(
      runFinfetFinHeightEffect({
        finHeightNm: Number.NaN,
        finWidthNm: 10,
        layoutWidthNm: 20,
      }),
    );
    expect(error.issues[0].code).toBe("invalid_field");
  });

  it("rejects missing required inputs", () => {
    const error = errorOf(runFinfetFinHeightEffect({ finHeightNm: 5 }));
    expect(error.code).toBe("invalid_input");
    expect(error.issues.length).toBeGreaterThan(0);
  });

  it("rejects unsupported input fields", () => {
    const error = errorOf(
      runFinfetFinHeightEffect({
        fins: 2,
        finHeightNm: 5,
        finWidthNm: 10,
        layoutWidthNm: 20,
      }),
    );
    expect(error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const error = errorOf(runFinfetFinHeightEffect(null));
    expect(error.issues[0].code).toBe("object_required");
  });
});
