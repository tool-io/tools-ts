import { describe, expect, it } from "vitest";
import { runBreedingValueAccuracy } from "./tool.js";

describe("EBV Accuracy", () => {
  it("takes the square root of the reliability", () =>
    expect(runBreedingValueAccuracy({ reliabilitySquared: 0.25 })).toEqual({
      ok: true,
      output: { accuracyCorrelation: 0.5 },
    }));
  it("defaults to a reliability of 0.5", () =>
    expect(runBreedingValueAccuracy({})).toEqual({
      ok: true,
      output: { accuracyCorrelation: Math.sqrt(0.5) },
    }));
  it("maps perfect reliability to unit accuracy", () =>
    expect(runBreedingValueAccuracy({ reliabilitySquared: 1 })).toEqual({
      ok: true,
      output: { accuracyCorrelation: 1 },
    }));
  it("maps zero reliability to zero accuracy", () =>
    expect(runBreedingValueAccuracy({ reliabilitySquared: 0 })).toEqual({
      ok: true,
      output: { accuracyCorrelation: 0 },
    }));
  it("passes fractional reliabilities through the square root", () =>
    expect(runBreedingValueAccuracy({ reliabilitySquared: 0.81 })).toEqual({
      ok: true,
      output: { accuracyCorrelation: 0.9 },
    }));
  it("rejects reliability above one", () => {
    const result = runBreedingValueAccuracy({ reliabilitySquared: 1.1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative reliability", () => {
    const result = runBreedingValueAccuracy({ reliabilitySquared: -0.2 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("reliabilitySquared");
  });
});
