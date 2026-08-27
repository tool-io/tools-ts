import { describe, expect, it } from "vitest";
import { runProteinIsoelectricPoint } from "./tool.js";

describe("Simple Protein pI", () => {
  it("shifts basic for excess basic residues", () =>
    expect(
      runProteinIsoelectricPoint({ acidicResidues: 30, basicResidues: 35 }),
    ).toEqual({ ok: true, output: { isoelectricPointEstimate: 7.25 } }));
  it("returns neutral for balanced counts", () =>
    expect(
      runProteinIsoelectricPoint({ acidicResidues: 40, basicResidues: 40 }),
    ).toEqual({ ok: true, output: { isoelectricPointEstimate: 7 } }));
  it("shifts acidic for excess acidic residues", () =>
    expect(
      runProteinIsoelectricPoint({ acidicResidues: 46, basicResidues: 34 }),
    ).toEqual({ ok: true, output: { isoelectricPointEstimate: 6.4 } }));
  it("clamps strongly basic proteins at twelve", () =>
    expect(
      runProteinIsoelectricPoint({ acidicResidues: 0, basicResidues: 120 }),
    ).toEqual({ ok: true, output: { isoelectricPointEstimate: 12 } }));
  it("clamps strongly acidic proteins at two", () =>
    expect(
      runProteinIsoelectricPoint({ acidicResidues: 120, basicResidues: 0 }),
    ).toEqual({ ok: true, output: { isoelectricPointEstimate: 2 } }));
  it("returns neutral for zero counts", () =>
    expect(
      runProteinIsoelectricPoint({ acidicResidues: 0, basicResidues: 0 }),
    ).toEqual({ ok: true, output: { isoelectricPointEstimate: 7 } }));
});
