import { describe, expect, it } from "vitest";
import {
  detectFictitiousVendorDuplicates,
  fictitiousVendorExample,
  runFictitiousVendor,
} from "./tool.js";

describe("fictitious vendor W-9 bank duplicate detector", () => {
  it("reproduces its canonical example", () => {
    expect(runFictitiousVendor(fictitiousVendorExample.input)).toEqual({
      ok: true,
      output: fictitiousVendorExample.output,
    });
  });

  it("detects duplicate normalized tax IDs", () => {
    expect(
      detectFictitiousVendorDuplicates({
        activeFlags: [1, 1],
        bankAccounts: ["A", "B"],
        taxIds: ["TAX-1", " tax-1 "],
        vendorIds: ["V-1", "V-2"],
      }).duplicateTaxIds,
    ).toEqual(["tax-1"]);
  });

  it("counts active vendors missing tax or bank data", () => {
    expect(
      detectFictitiousVendorDuplicates({
        activeFlags: [1, 1, 0],
        bankAccounts: ["", "B", ""],
        taxIds: ["A", "", ""],
        vendorIds: ["V-1", "V-2", "V-3"],
      }).incompleteActiveCount,
    ).toBe(2);
  });

  it("rejects mismatched vendor records", () => {
    expect(
      runFictitiousVendor({
        activeFlags: [1],
        bankAccounts: ["A"],
        taxIds: ["T"],
        vendorIds: [],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "vendor_data_length_mismatch", field: "" }] },
      ok: false,
    });
  });
});
