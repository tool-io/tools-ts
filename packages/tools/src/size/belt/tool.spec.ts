import { describe, expect, it } from "vitest";
import { recommendBeltSize } from "./tool.js";

describe("recommendBeltSize", () => {
  it("recommends equivalent sizes from centimeters", () => {
    expect(recommendBeltSize({ values: { waist: 86 } })).toMatchObject({
      ok: true,
      output: {
        equivalents: ["US 36 in", "Suggested center-hole length 85 cm"],
        kind: "belt",
        measurementsCm: { waist: 86 },
        primary: "EU 85",
      },
    });
  });

  it("accepts inches and normalizes them to centimeters", () => {
    expect(
      recommendBeltSize({ unit: "in", values: { waist: 34 } }),
    ).toMatchObject({
      ok: true,
      output: { measurementsCm: { waist: 86.36 }, primary: "EU 85" },
    });
  });

  it("rejects absent, non-finite, and out-of-range measurements", () => {
    expect(recommendBeltSize({ values: {} }).ok).toBe(false);
    expect(recommendBeltSize({ values: { waist: Infinity } }).ok).toBe(false);
    expect(recommendBeltSize({ values: { waist: 20 } }).ok).toBe(false);
  });
});
