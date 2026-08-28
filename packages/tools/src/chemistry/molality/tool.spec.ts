import { describe, expect, it } from "vitest";
import { runMolality, molalityExample } from "./tool.js";

describe("Molality Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMolality(molalityExample.input)).toEqual({
      ok: true,
      output: molalityExample.output,
    });
  });

  it("computes half molal", () => {
    expect(runMolality({ molesSolute: 0.2, solventMassKg: 0.4 })).toEqual({
      ok: true,
      output: { molality: 0.5 },
    });
  });

  it("computes whole-number molality", () => {
    expect(runMolality({ molesSolute: 2, solventMassKg: 1 })).toEqual({
      ok: true,
      output: { molality: 2 },
    });
  });

  it("rejects a zero solvent mass", () => {
    expect(runMolality({ molesSolute: 1, solventMassKg: 0 }).ok).toBe(false);
  });

  it("rejects negative moles", () => {
    expect(runMolality({ molesSolute: -2, solventMassKg: 1 }).ok).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runMolality({ molesSolute: 1 }).ok).toBe(false);
    expect(runMolality({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMolality(42).ok).toBe(false);
  });
});
