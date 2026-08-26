import { describe, expect, it } from "vitest";
import {
  netPhotosynthesisRateExample,
  runNetPhotosynthesisRate,
} from "./tool.js";

describe("Net Photosynthesis Rate", () => {
  it("matches the canonical example", () => {
    expect(
      runNetPhotosynthesisRate(netPhotosynthesisRateExample.input),
    ).toEqual({ ok: true, output: netPhotosynthesisRateExample.output });
  });

  it("accepts zero uptake at night", () => {
    expect(
      runNetPhotosynthesisRate({ co2UptakeUmolPerSecond: 0, leafAreaM2: 0.1 }),
    ).toEqual({ ok: true, output: { netPhotosynthesisRate: 0 } });
  });

  it("normalises a whole leaf flux to its area", () => {
    expect(
      runNetPhotosynthesisRate({
        co2UptakeUmolPerSecond: 4.5,
        leafAreaM2: 0.03,
      }),
    ).toEqual({ ok: true, output: { netPhotosynthesisRate: 150 } });
  });

  it("dilutes the rate across a larger leaf area", () => {
    expect(
      runNetPhotosynthesisRate({
        co2UptakeUmolPerSecond: 25,
        leafAreaM2: 0.25,
      }),
    ).toEqual({ ok: true, output: { netPhotosynthesisRate: 100 } });
  });

  it("rejects zero leaf area with a stable field", () => {
    const result = runNetPhotosynthesisRate({
      co2UptakeUmolPerSecond: 10,
      leafAreaM2: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "leafAreaM2",
      });
  });

  it("rejects negative uptake through the schema", () => {
    expect(
      runNetPhotosynthesisRate({ co2UptakeUmolPerSecond: -1, leafAreaM2: 0.05 })
        .ok,
    ).toBe(false);
  });

  it("rejects negative and non finite areas through the schema and guard", () => {
    expect(
      runNetPhotosynthesisRate({
        co2UptakeUmolPerSecond: 10,
        leafAreaM2: -0.05,
      }).ok,
    ).toBe(false);
    expect(
      runNetPhotosynthesisRate({
        co2UptakeUmolPerSecond: 10,
        leafAreaM2: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });
});
