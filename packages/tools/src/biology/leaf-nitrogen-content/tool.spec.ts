import { describe, expect, it } from "vitest";
import { leafNitrogenContentExample, runLeafNitrogenContent } from "./tool.js";

describe("Leaf Nitrogen Content", () => {
  it("publishes an executable example", () =>
    expect(runLeafNitrogenContent(leafNitrogenContentExample.input)).toEqual({
      ok: true,
      output: leafNitrogenContentExample.output,
    }));
  it("doubles when nitrogen mass doubles at fixed leaf mass", () =>
    expect(
      runLeafNitrogenContent({ leafDryMassG: 1.5, nitrogenMassMg: 48 }),
    ).toEqual({ ok: true, output: { leafNitrogenMgPerG: 32 } }));
  it("rises as the leaf dry mass shrinks", () =>
    expect(
      runLeafNitrogenContent({ leafDryMassG: 0.75, nitrogenMassMg: 24 }),
    ).toEqual({ ok: true, output: { leafNitrogenMgPerG: 32 } }));
  it("keeps fractional concentrations exact", () =>
    expect(
      runLeafNitrogenContent({ leafDryMassG: 8, nitrogenMassMg: 10 }),
    ).toEqual({ ok: true, output: { leafNitrogenMgPerG: 1.25 } }));
  it("rejects zero nitrogen mass", () => {
    const result = runLeafNitrogenContent({
      leafDryMassG: 1.5,
      nitrogenMassMg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("nitrogenMassMg");
  });
  it("rejects zero leaf dry mass", () => {
    const result = runLeafNitrogenContent({
      leafDryMassG: 0,
      nitrogenMassMg: 24,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].field).toBe("leafDryMassG");
  });
  it("rejects negative masses", () => {
    const result = runLeafNitrogenContent({
      leafDryMassG: 1.5,
      nitrogenMassMg: -24,
    });
    expect(result.ok).toBe(false);
  });
});
