import { describe, expect, it } from "vitest";
import {
  acreVirgateHideConverterExample,
  runAcreVirgateHideConverter,
} from "./tool.js";

describe("acre-virgate-hide-converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAcreVirgateHideConverter(acreVirgateHideConverterExample.input),
    ).toEqual({ ok: true, output: acreVirgateHideConverterExample.output });
  });

  it("honours a custom hide size of six virgates", () => {
    expect(
      runAcreVirgateHideConverter({
        convention: "custom_acres_per_hide",
        customAcresPerHide: 180,
        virgates: 6,
        oxgangs: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        totalAcres: 292.5,
        totalVirgates: 292.5 / 45,
        totalOxgangs: 292.5 / 22.5,
        hideEquivalent: 292.5 / 180,
      },
    });
  });

  it("rejects a non-positive custom hide size", () => {
    expect(
      runAcreVirgateHideConverter({
        convention: "custom_acres_per_hide",
        customAcresPerHide: 0,
      }).ok,
    ).toBe(false);
  });
});
