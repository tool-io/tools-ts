import { describe, expect, it } from "vitest";
import { runSpecificLeafArea, specificLeafAreaExample } from "./tool.js";

describe("Specific Leaf Area", () => {
  it("publishes an executable example", () =>
    expect(runSpecificLeafArea(specificLeafAreaExample.input)).toEqual({
      ok: true,
      output: specificLeafAreaExample.output,
    }));
  it("calculates a valid result", () =>
    expect(
      runSpecificLeafArea({ leafAreaCm2: 300, leafDryMassG: 1.5 }),
    ).toEqual({ ok: true, output: { specificLeafArea: 200 } }));
  it("drops for thicker leaves", () =>
    expect(
      runSpecificLeafArea({ leafAreaCm2: 250, leafDryMassG: 2.5 }),
    ).toEqual({ ok: true, output: { specificLeafArea: 100 } }));
  it("accepts fractional areas", () =>
    expect(
      runSpecificLeafArea({ leafAreaCm2: 2.5, leafDryMassG: 0.5 }),
    ).toEqual({ ok: true, output: { specificLeafArea: 5 } }));
  it("rejects zero area", () => {
    const result = runSpecificLeafArea({
      leafAreaCm2: 0,
      leafDryMassG: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("leafAreaCm2");
  });
  it("rejects zero mass", () =>
    expect(runSpecificLeafArea({ leafAreaCm2: 250, leafDryMassG: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative mass", () =>
    expect(runSpecificLeafArea({ leafAreaCm2: 250, leafDryMassG: -5 }).ok).toBe(
      false,
    ));
  it("rejects non-finite area", () =>
    expect(
      runSpecificLeafArea({
        leafAreaCm2: Number.POSITIVE_INFINITY,
        leafDryMassG: 5,
      }).ok,
    ).toBe(false));
});
