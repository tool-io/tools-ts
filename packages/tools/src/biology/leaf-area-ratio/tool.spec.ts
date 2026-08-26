import { describe, expect, it } from "vitest";
import { leafAreaRatioExample, runLeafAreaRatio } from "./tool.js";

describe("Leaf Area Ratio", () => {
  it("matches the canonical example", () => {
    expect(runLeafAreaRatio(leafAreaRatioExample.input)).toEqual({
      ok: true,
      output: leafAreaRatioExample.output,
    });
  });

  it("ranks seedlings above woody saplings", () => {
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: 80, plantDryMassG: 0.4 }),
    ).toEqual({ ok: true, output: { leafAreaRatio: 200 } });
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: 400, plantDryMassG: 80 }),
    ).toEqual({ ok: true, output: { leafAreaRatio: 5 } });
  });

  it("accepts fractional measurements", () => {
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: 12.5, plantDryMassG: 0.25 }),
    ).toEqual({ ok: true, output: { leafAreaRatio: 50 } });
  });

  it("scales inversely with plant dry mass", () => {
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: 500, plantDryMassG: 2.5 }),
    ).toEqual({ ok: true, output: { leafAreaRatio: 200 } });
  });

  it("rejects zero leaf area", () => {
    const result = runLeafAreaRatio({
      totalLeafAreaCm2: 0,
      plantDryMassG: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_value",
        field: "totalLeafAreaCm2",
      });
  });

  it("rejects zero dry mass", () => {
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: 100, plantDryMassG: 0 }).ok,
    ).toBe(false);
  });

  it("rejects negative inputs through the schema and guard", () => {
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: -10, plantDryMassG: 5 }).ok,
    ).toBe(false);
    expect(
      runLeafAreaRatio({ totalLeafAreaCm2: 100, plantDryMassG: -1 }).ok,
    ).toBe(false);
  });
});
