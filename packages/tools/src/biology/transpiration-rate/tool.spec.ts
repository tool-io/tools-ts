import { describe, expect, it } from "vitest";
import { transpirationRateExample, runTranspirationRate } from "./tool.js";

describe("Transpiration Rate", () => {
  it("matches the canonical example", () => {
    expect(runTranspirationRate(transpirationRateExample.input)).toEqual({
      ok: true,
      output: transpirationRateExample.output,
    });
  });

  it("accepts zero water loss in saturated air", () => {
    expect(
      runTranspirationRate({ waterLossMmolPerSecond: 0, leafAreaM2: 0.02 }),
    ).toEqual({ ok: true, output: { transpirationRate: 0 } });
  });

  it("normalises a chamber flux to its area", () => {
    expect(
      runTranspirationRate({ waterLossMmolPerSecond: 1.5, leafAreaM2: 0.03 }),
    ).toEqual({ ok: true, output: { transpirationRate: 50 } });
  });

  it("dilutes the rate across a larger leaf area", () => {
    expect(
      runTranspirationRate({ waterLossMmolPerSecond: 6, leafAreaM2: 0.3 }),
    ).toEqual({ ok: true, output: { transpirationRate: 20 } });
  });

  it("rejects zero leaf area with a stable field", () => {
    const result = runTranspirationRate({
      waterLossMmolPerSecond: 2,
      leafAreaM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "leafAreaM2",
      });
  });

  it("rejects negative water loss through the schema", () => {
    expect(
      runTranspirationRate({ waterLossMmolPerSecond: -2, leafAreaM2: 0.05 }).ok,
    ).toBe(false);
  });

  it("rejects negative and non finite areas through the schema and guard", () => {
    expect(
      runTranspirationRate({ waterLossMmolPerSecond: 2, leafAreaM2: -0.05 }).ok,
    ).toBe(false);
    expect(
      runTranspirationRate({
        waterLossMmolPerSecond: 2,
        leafAreaM2: Number.NaN,
      }).ok,
    ).toBe(false);
  });
});
