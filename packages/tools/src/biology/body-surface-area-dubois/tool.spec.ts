import { describe, expect, it } from "vitest";
import {
  bodySurfaceAreaDuboisExample,
  runBodySurfaceAreaDubois,
} from "./tool.js";

describe("BSA DuBois", () => {
  it("publishes an executable example", () =>
    expect(
      runBodySurfaceAreaDubois(bodySurfaceAreaDuboisExample.input),
    ).toEqual({
      ok: true,
      output: bodySurfaceAreaDuboisExample.output,
    }));
  it("scales height and weight exponents by the DuBois constant", () =>
    expect(runBodySurfaceAreaDubois({ heightCm: 180, weightKg: 80 })).toEqual({
      ok: true,
      output: { bsaM2: 1.996421022275045 },
    }));
  it("rejects zero height", () => {
    const result = runBodySurfaceAreaDubois({ heightCm: 0, weightKg: 60 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects zero weight", () => {
    const result = runBodySurfaceAreaDubois({ heightCm: 170, weightKg: 0 });
    expect(result.ok).toBe(false);
  });
  it("rejects negative height", () => {
    const result = runBodySurfaceAreaDubois({ heightCm: -170, weightKg: 60 });
    expect(result.ok).toBe(false);
  });
});
