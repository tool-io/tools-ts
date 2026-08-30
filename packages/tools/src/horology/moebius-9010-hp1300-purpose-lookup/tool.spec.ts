import { describe, expect, it } from "vitest";
import {
  lookupMoebius9010Hp1300Purpose,
  moebiusOilLookupExample,
  runMoebiusOilLookup,
} from "./tool.js";

describe("Moebius 9010 and HP1300 purpose lookup", () => {
  it("reproduces the canonical 9010 product fact", () => {
    expect(runMoebiusOilLookup(moebiusOilLookupExample.input)).toEqual({
      ok: true,
      output: moebiusOilLookupExample.output,
    });
  });

  it("returns the HP1300 product name and viscosity", () => {
    expect(lookupMoebius9010Hp1300Purpose({ product: "hp1300" })).toMatchObject(
      { productName: "SYNT-HP 1300 9104", viscosityAt20C: 1250 },
    );
  });

  it("describes HP1300 as a high-pressure, high-torque family", () => {
    expect(
      lookupMoebius9010Hp1300Purpose({ product: "hp1300" }).application,
    ).toContain("significant pressure and torque");
  });

  it("keeps the exact-point selection caution for both products", () => {
    expect(
      lookupMoebius9010Hp1300Purpose({ product: "hp1300" }).caution,
    ).toContain("caliber or equipment specification");
  });

  it("rejects an unsupported product at the public boundary", () => {
    expect(runMoebiusOilLookup({ product: "9504" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "product" }] },
      ok: false,
    });
  });
});
