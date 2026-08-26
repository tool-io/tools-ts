import { describe, expect, it } from "vitest";
import { edgeBandingTrimExample, runEdgeBandingTrim } from "./tool.js";

describe("edge banding trim allowance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEdgeBandingTrim(edgeBandingTrimExample.input)).toEqual({
      ok: true,
      output: edgeBandingTrimExample.output,
    });
  });

  it("defaults to a five millimetre trim allowance", () => {
    expect(runEdgeBandingTrim({ roughLengthMm: 810 })).toEqual({
      ok: true,
      output: { finalLengthAfterTrimMm: 800 },
    });
  });

  it("keeps the rough length for zero trimming", () => {
    expect(
      runEdgeBandingTrim({ roughLengthMm: 810, trimAllowanceMm: 0 }),
    ).toEqual({
      ok: true,
      output: { finalLengthAfterTrimMm: 810 },
    });
  });

  it("accepts a one millimetre remainder", () => {
    expect(
      runEdgeBandingTrim({ roughLengthMm: 11, trimAllowanceMm: 5 }),
    ).toEqual({
      ok: true,
      output: { finalLengthAfterTrimMm: 1 },
    });
  });

  it("supports asymmetric heavy trimming", () => {
    expect(
      runEdgeBandingTrim({ roughLengthMm: 200, trimAllowanceMm: 75 }),
    ).toEqual({
      ok: true,
      output: { finalLengthAfterTrimMm: 50 },
    });
  });

  it("rejects an exactly zero remainder with the stable code", () => {
    const result = runEdgeBandingTrim({
      roughLengthMm: 10,
      trimAllowanceMm: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("negative_length");
  });

  it("rejects a negative remainder with the stable code", () => {
    const result = runEdgeBandingTrim({
      roughLengthMm: 9,
      trimAllowanceMm: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("negative_length");
  });

  it("rejects zero rough length with the stable code", () => {
    const result = runEdgeBandingTrim({ roughLengthMm: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_rough_length");
  });

  it("rejects negative rough length with the stable code", () => {
    const result = runEdgeBandingTrim({ roughLengthMm: -100 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_rough_length");
  });

  it("rejects negative trim allowances", () => {
    const result = runEdgeBandingTrim({
      roughLengthMm: 100,
      trimAllowanceMm: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the rough length", () => {
    expect(runEdgeBandingTrim({}).ok).toBe(false);
  });
});
