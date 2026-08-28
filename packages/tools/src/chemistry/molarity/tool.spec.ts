import { describe, expect, it } from "vitest";
import { runMolarity, molarityExample } from "./tool.js";

describe("Molarity Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMolarity(molarityExample.input)).toEqual({
      ok: true,
      output: molarityExample.output,
    });
  });

  it("computes half molar from three halves moles in three liters", () => {
    expect(runMolarity({ molesSolute: 1.5, volumeLiters: 3 })).toEqual({
      ok: true,
      output: { molarity: 0.5 },
    });
  });

  it("computes whole-number molarity", () => {
    expect(runMolarity({ molesSolute: 4, volumeLiters: 2 })).toEqual({
      ok: true,
      output: { molarity: 2 },
    });
  });

  it("rejects zero volume", () => {
    expect(runMolarity({ molesSolute: 1, volumeLiters: 0 }).ok).toBe(false);
  });

  it("rejects negative moles", () => {
    expect(runMolarity({ molesSolute: -1, volumeLiters: 1 }).ok).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runMolarity({ molesSolute: 1 }).ok).toBe(false);
    expect(runMolarity({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMolarity(true).ok).toBe(false);
  });
});
