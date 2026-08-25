import { describe, expect, it } from "vitest";
import {
  incotermsResponsibilityMatrixLookupExample,
  runIncotermsResponsibilityMatrixLookup,
} from "./tool.js";

describe("logistics/incoterms-responsibility-matrix-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIncotermsResponsibilityMatrixLookup(
        incotermsResponsibilityMatrixLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: incotermsResponsibilityMatrixLookupExample.output,
    });
  });

  it("assigns everything to the buyer under EXW and requires seller insurance under CIF", () => {
    const exw = runIncotermsResponsibilityMatrixLookup({ term: "EXW" });
    const cif = runIncotermsResponsibilityMatrixLookup({ term: "CIF" });
    if (!exw.ok || !cif.ok) throw new Error("expected success");
    expect(exw.output.mainCarriagePayer).toBe("buyer");
    expect(exw.output.exportClearance).toBe("buyer");
    expect(cif.output.insuranceObligation).toBe("seller_required");
    expect(cif.output.riskTransferPoint).toContain("port of shipment");
  });

  it("rejects terms outside the Incoterms 2020 list", () => {
    expect(
      runIncotermsResponsibilityMatrixLookup({ term: "FOT" } as never).ok,
    ).toBe(false);
  });
});
