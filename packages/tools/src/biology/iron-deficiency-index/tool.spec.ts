import { describe, expect, it } from "vitest";
import { runIronDeficiencyIndex } from "./tool.js";

describe("Iron Deficiency Indicator", () => {
  it("flags low ferritin and low saturation", () =>
    expect(
      runIronDeficiencyIndex({
        ferritinNgMl: 12,
        transferrinSaturationPercent: 15,
      }),
    ).toEqual({ ok: true, output: { ironDeficient: true } }));
  it("clears when ferritin reaches thirty", () =>
    expect(
      runIronDeficiencyIndex({
        ferritinNgMl: 30,
        transferrinSaturationPercent: 10,
      }),
    ).toEqual({ ok: true, output: { ironDeficient: false } }));
  it("clears when saturation reaches twenty", () =>
    expect(
      runIronDeficiencyIndex({
        ferritinNgMl: 12,
        transferrinSaturationPercent: 20,
      }),
    ).toEqual({ ok: true, output: { ironDeficient: false } }));
  it("requires both criteria to be met", () =>
    expect(
      runIronDeficiencyIndex({
        ferritinNgMl: 80,
        transferrinSaturationPercent: 45,
      }),
    ).toEqual({ ok: true, output: { ironDeficient: false } }));
  it("accepts boundary zeros", () =>
    expect(
      runIronDeficiencyIndex({
        ferritinNgMl: 0,
        transferrinSaturationPercent: 0,
      }),
    ).toEqual({ ok: true, output: { ironDeficient: true } }));
  it("rejects negative ferritin", () => {
    const result = runIronDeficiencyIndex({
      ferritinNgMl: -1,
      transferrinSaturationPercent: 15,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative saturation", () => {
    const result = runIronDeficiencyIndex({
      ferritinNgMl: 12,
      transferrinSaturationPercent: -20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].field).toBe("transferrinSaturationPercent");
  });
});
