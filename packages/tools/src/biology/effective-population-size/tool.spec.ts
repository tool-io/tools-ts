import { describe, expect, it } from "vitest";
import {
  effectivePopulationSizeExample,
  runEffectivePopulationSize,
} from "./tool.js";

describe("Effective Population Size", () => {
  it("matches the canonical example", () => {
    expect(
      runEffectivePopulationSize(effectivePopulationSizeExample.input),
    ).toEqual({ ok: true, output: effectivePopulationSizeExample.output });
  });
  it("equals the census size for an even sex ratio", () =>
    expect(runEffectivePopulationSize({ males: 50, females: 50 })).toEqual({
      ok: true,
      output: { effectiveSize: 100 },
    }));
  it("is dominated by the rarer sex", () =>
    expect(runEffectivePopulationSize({ males: 10, females: 90 })).toEqual({
      ok: true,
      output: { effectiveSize: 36 },
    }));
  it("handles a single pair", () =>
    expect(runEffectivePopulationSize({ males: 1, females: 1 })).toEqual({
      ok: true,
      output: { effectiveSize: 2 },
    }));
  it("yields fractional values for skewed ratios", () =>
    expect(runEffectivePopulationSize({ males: 3, females: 1 })).toEqual({
      ok: true,
      output: { effectiveSize: 3 },
    }));
  it("rejects zero males", () =>
    expect(runEffectivePopulationSize({ males: 0, females: 10 }).ok).toBe(
      false,
    ));
  it("rejects negative females", () =>
    expect(runEffectivePopulationSize({ males: 5, females: -1 }).ok).toBe(
      false,
    ));
  it("rejects non-integer counts", () =>
    expect(runEffectivePopulationSize({ males: 2.5, females: 4 }).ok).toBe(
      false,
    ));
});
