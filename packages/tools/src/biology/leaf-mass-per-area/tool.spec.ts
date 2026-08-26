import { describe, expect, it } from "vitest";
import { runLeafMassPerArea, leafMassPerAreaExample } from "./tool.js";

describe("LMA", () => {
  it("publishes an executable example", () =>
    expect(runLeafMassPerArea(leafMassPerAreaExample.input)).toEqual({
      ok: true,
      output: leafMassPerAreaExample.output,
    }));
  it("calculates a valid result", () =>
    expect(runLeafMassPerArea({ leafAreaCm2: 250, leafDryMassG: 2 })).toEqual({
      ok: true,
      output: { leafMassPerArea: 80 },
    }));
  it("inverts specific leaf area", () =>
    expect(runLeafMassPerArea({ leafAreaCm2: 250, leafDryMassG: 5 })).toEqual({
      ok: true,
      output: { leafMassPerArea: 200 },
    }));
  it("converts square centimetres to square metres", () =>
    expect(
      runLeafMassPerArea({ leafAreaCm2: 10000, leafDryMassG: 100 }),
    ).toEqual({ ok: true, output: { leafMassPerArea: 100 } }));
  it("accepts fractional masses", () =>
    expect(
      runLeafMassPerArea({ leafAreaCm2: 500, leafDryMassG: 0.25 }),
    ).toEqual({ ok: true, output: { leafMassPerArea: 5 } }));
  it("rejects zero area", () => {
    const result = runLeafMassPerArea({
      leafAreaCm2: 0,
      leafDryMassG: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("leafAreaCm2");
  });
  it("rejects zero mass", () =>
    expect(runLeafMassPerArea({ leafAreaCm2: 500, leafDryMassG: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative area", () =>
    expect(runLeafMassPerArea({ leafAreaCm2: -500, leafDryMassG: 5 }).ok).toBe(
      false,
    ));
});
