import { describe, expect, it } from "vitest";
import {
  calculateReturnMigrationProportionLookup,
  runReturnMigrationProportionLookup,
  returnMigrationProportionLookupExample,
} from "./tool.js";

describe("demography/return-migration-proportion-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReturnMigrationProportionLookup(
        returnMigrationProportionLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: returnMigrationProportionLookupExample.output,
    });
  });

  it("reaches one hundred percent when everyone is returning", () => {
    expect(
      calculateReturnMigrationProportionLookup({
        returnMigrants: 900,
        totalInMigrants: 900,
      }).returnProportionPercent,
    ).toBe(100);
  });

  it("rejects inconsistent counts", () => {
    expect(
      runReturnMigrationProportionLookup({
        returnMigrants: 10,
        totalInMigrants: 9,
      }).ok,
    ).toBe(false);
    expect(
      runReturnMigrationProportionLookup({
        returnMigrants: -1,
        totalInMigrants: 9,
      }).ok,
    ).toBe(false);
  });
});
