import { describe, expect, it } from "vitest";
import { colonyFormingUnitsExample, runColonyFormingUnits } from "./tool.js";

describe("CFU Total Estimate", () => {
  it("matches the canonical example", () => {
    expect(runColonyFormingUnits(colonyFormingUnitsExample.input)).toEqual({
      ok: true,
      output: colonyFormingUnitsExample.output,
    });
  });
  it("multiplies concentration by volume", () =>
    expect(
      runColonyFormingUnits({ cfuPerMl: 5000, cultureVolumeMl: 2 }),
    ).toEqual({ ok: true, output: { totalColonies: 10000 } }));
  it("handles fractional volumes", () =>
    expect(
      runColonyFormingUnits({ cfuPerMl: 800, cultureVolumeMl: 1.5 }),
    ).toEqual({ ok: true, output: { totalColonies: 1200 } }));
  it("returns zero for a zero concentration", () =>
    expect(runColonyFormingUnits({ cfuPerMl: 0, cultureVolumeMl: 1 })).toEqual({
      ok: true,
      output: { totalColonies: 0 },
    }));
  it("rejects negative concentration", () =>
    expect(runColonyFormingUnits({ cfuPerMl: -5, cultureVolumeMl: 1 }).ok).toBe(
      false,
    ));
  it("rejects zero volume", () =>
    expect(runColonyFormingUnits({ cfuPerMl: 5, cultureVolumeMl: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative volume", () =>
    expect(runColonyFormingUnits({ cfuPerMl: 5, cultureVolumeMl: -2 }).ok).toBe(
      false,
    ));
});
