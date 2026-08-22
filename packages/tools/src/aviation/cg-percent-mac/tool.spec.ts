import { describe, expect, it } from "vitest";
import {
  cgPercentMacExample,
  calculateCgPercentMac,
  runCgPercentMac,
} from "./tool.js";

describe("cg percent mac calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCgPercentMac(cgPercentMacExample.input)).toEqual({
      ok: true,
      output: cgPercentMacExample.output,
    });
  });

  it("places the CG at the leading edge at zero offset", () => {
    expect(
      calculateCgPercentMac({
        cgAftOfDatumIn: 34,
        lemacAftOfDatumIn: 34,
        macInches: 60,
      }),
    ).toEqual({ percentMac: 0 });
  });

  it("rejects a non-positive MAC through execution", () => {
    expect(
      runCgPercentMac({
        cgAftOfDatumIn: 40,
        lemacAftOfDatumIn: 34,
        macInches: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_mac" }] },
      ok: false,
    });
  });
});
