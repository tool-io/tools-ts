import { describe, expect, it } from "vitest";
import { fev1FvcRatioExample, runFev1FvcRatio } from "./tool.js";

describe("FEV1/FVC Ratio", () => {
  it("publishes an executable example", () =>
    expect(runFev1FvcRatio(fev1FvcRatioExample.input)).toEqual({
      ok: true,
      output: fev1FvcRatioExample.output,
    }));
  it("divides FEV1 by FVC", () =>
    expect(runFev1FvcRatio({ fev1L: 3, fvcL: 4 })).toEqual({
      ok: true,
      output: { fev1FvcRatio: 0.75 },
    }));
  it("handles reduced ratios", () =>
    expect(runFev1FvcRatio({ fev1L: 2.5, fvcL: 4 })).toEqual({
      ok: true,
      output: { fev1FvcRatio: 0.625 },
    }));
  it("allows FEV1 equal to FVC", () =>
    expect(runFev1FvcRatio({ fev1L: 4, fvcL: 4 })).toEqual({
      ok: true,
      output: { fev1FvcRatio: 1 },
    }));
  it("rejects zero FVC with invalid_volumes", () => {
    const result = runFev1FvcRatio({ fev1L: 3, fvcL: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_volumes");
  });
  it("rejects FEV1 above FVC with invalid_volumes", () => {
    const result = runFev1FvcRatio({ fev1L: 4.5, fvcL: 4 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_volumes");
  });
  it("rejects negative volumes", () =>
    expect(runFev1FvcRatio({ fev1L: -1, fvcL: 4 }).ok).toBe(false));
  it("rejects missing inputs", () =>
    expect(runFev1FvcRatio({ fev1L: 3 }).ok).toBe(false));
});
