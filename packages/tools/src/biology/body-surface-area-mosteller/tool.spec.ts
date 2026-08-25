import { describe, expect, it } from "vitest";
import {
  bodySurfaceAreaMostellerExample,
  runBodySurfaceAreaMosteller,
} from "./tool.js";

describe("BSA Mosteller", () => {
  it("publishes an executable example", () =>
    expect(
      runBodySurfaceAreaMosteller(bodySurfaceAreaMostellerExample.input),
    ).toEqual({
      ok: true,
      output: bodySurfaceAreaMostellerExample.output,
    }));
  it("computes the square root of height times weight over 3600", () =>
    expect(
      runBodySurfaceAreaMosteller({ heightCm: 180, weightKg: 80 }),
    ).toEqual({ ok: true, output: { bsaM2: 2 } }));
  it("rejects zero height", () => {
    const result = runBodySurfaceAreaMosteller({
      heightCm: 0,
      weightKg: 60,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero weight", () => {
    const result = runBodySurfaceAreaMosteller({
      heightCm: 170,
      weightKg: 0,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects negative weight", () => {
    const result = runBodySurfaceAreaMosteller({
      heightCm: 170,
      weightKg: -60,
    });
    expect(result.ok).toBe(false);
  });
});
