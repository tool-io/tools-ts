import { describe, expect, it } from "vitest";
import { eviTwoBandExample, runEviTwoBand } from "./tool.js";

describe("Two-Band EVI", () => {
  it("publishes an executable example", () =>
    expect(runEviTwoBand(eviTwoBandExample.input)).toEqual({
      ok: true,
      output: eviTwoBandExample.output,
    }));
  it("returns zero when bands match", () =>
    expect(runEviTwoBand({ nirReflectance: 0.4, redReflectance: 0.4 })).toEqual(
      {
        ok: true,
        output: { twoBandEvi: 0 },
      },
    ));
  it("returns negative values when red exceeds NIR", () => {
    const result = runEviTwoBand({ nirReflectance: 0, redReflectance: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.twoBandEvi).toBeCloseTo(-2.5 / 3.4, 12);
  });
  it("rejects reflectances outside zero to one before the denominator guard can apply", () => {
    const result = runEviTwoBand({ nirReflectance: -3.4, redReflectance: 1 });
    expect(result.ok).toBe(false);
  });
  it("rejects reflectances above one", () =>
    expect(runEviTwoBand({ nirReflectance: 0.5, redReflectance: 1.1 }).ok).toBe(
      false,
    ));
});
