import { describe, expect, it } from "vitest";
import {
  fuelSurchargeIndexWeeklyLookupExample,
  runFuelSurchargeIndexWeeklyLookup,
} from "./tool.js";

describe("fuel-surcharge-index-weekly-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFuelSurchargeIndexWeeklyLookup(
        fuelSurchargeIndexWeeklyLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: fuelSurchargeIndexWeeklyLookupExample.output,
    });
  });

  it("returns the low bound percentage exactly at the low index", () => {
    const result = runFuelSurchargeIndexWeeklyLookup({
      indexValue: 100,
      lowIndexValue: 100,
      highIndexValue: 200,
      lowSurchargePercent: 10,
      highSurchargePercent: 20,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.surchargePercent as number).toBe(10);
  });
  it("rejects readings outside the bracket", () => {
    expect(
      runFuelSurchargeIndexWeeklyLookup({
        indexValue: 250,
        lowIndexValue: 100,
        highIndexValue: 200,
        lowSurchargePercent: 10,
        highSurchargePercent: 20,
      }).ok,
    ).toBe(false);
  });
});
