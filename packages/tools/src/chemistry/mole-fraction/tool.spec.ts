import { describe, expect, it } from "vitest";
import { runMoleFraction, moleFractionExample } from "./tool.js";

describe("Mole Fraction Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMoleFraction(moleFractionExample.input)).toEqual({
      ok: true,
      output: moleFractionExample.output,
    });
  });

  it("computes one half for equal amounts", () => {
    expect(runMoleFraction({ molesA: 2, molesB: 2 })).toEqual({
      ok: true,
      output: { moleFraction: 0.5 },
    });
  });

  it("computes three quarters when A dominates", () => {
    expect(runMoleFraction({ molesA: 3, molesB: 1 })).toEqual({
      ok: true,
      output: { moleFraction: 0.75 },
    });
  });

  it("returns one for a pure A component", () =>
    expect(runMoleFraction({ molesA: 1, molesB: 0 })).toEqual({
      ok: true,
      output: { moleFraction: 1 },
    }));

  it("rejects negative moles of A", () => {
    expect(runMoleFraction({ molesA: -1, molesB: 1 }).ok).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runMoleFraction({ molesA: 1 }).ok).toBe(false);
    expect(runMoleFraction({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMoleFraction("a,b").ok).toBe(false);
  });
});
