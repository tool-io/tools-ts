import { describe, expect, it } from "vitest";
import { quasiFermiLevelExample, runQuasiFermiLevel } from "./tool.js";
import type { QuasiFermiLevelOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runQuasiFermiLevel>,
): QuasiFermiLevelOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as QuasiFermiLevelOutput;
};

describe("Electron Quasi-Fermi Level Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQuasiFermiLevel(quasiFermiLevelExample.input)).toEqual({
      ok: true,
      output: quasiFermiLevelExample.output,
    });
  });

  it("reports zero shift at the intrinsic concentration", () => {
    expect(
      runQuasiFermiLevel({ electronConc: 1e10, intrinsicConc: 1e10 }),
    ).toEqual({ ok: true, output: { quasiFermiShiftEv: 0 } });
  });

  it("reports a negative shift below the intrinsic concentration", () => {
    expect(
      runQuasiFermiLevel({ electronConc: 1e9, intrinsicConc: 1e10 }),
    ).toEqual({
      ok: true,
      output: { quasiFermiShiftEv: -0.05952182465389611 },
    });
  });

  it("shifts by the thermal voltage per factor of e in concentration", () => {
    const base = outputOf(
      runQuasiFermiLevel({ electronConc: 1e16, intrinsicConc: 1e10 }),
    ).quasiFermiShiftEv;
    const raised = outputOf(
      runQuasiFermiLevel({
        electronConc: 1e16 * Math.E,
        intrinsicConc: 1e10,
      }),
    ).quasiFermiShiftEv;
    expect(raised - base).toBeCloseTo(0.02585, 12);
  });

  it("changes sign symmetrically around the intrinsic level", () => {
    const above = outputOf(
      runQuasiFermiLevel({ electronConc: 1e16, intrinsicConc: 1e10 }),
    ).quasiFermiShiftEv;
    const below = outputOf(
      runQuasiFermiLevel({ electronConc: 1e4, intrinsicConc: 1e10 }),
    ).quasiFermiShiftEv;
    expect(above + below).toBeCloseTo(0, 12);
  });

  it("increases monotonically with electron concentration", () => {
    const lower = outputOf(
      runQuasiFermiLevel({ electronConc: 1e12, intrinsicConc: 1e10 }),
    ).quasiFermiShiftEv;
    const higher = outputOf(
      runQuasiFermiLevel({ electronConc: 1e18, intrinsicConc: 1e10 }),
    ).quasiFermiShiftEv;
    expect(higher).toBeGreaterThan(lower);
  });

  it("handles concentration ratios that overflow direct division", () => {
    const result = runQuasiFermiLevel({
      electronConc: Number.MAX_VALUE,
      intrinsicConc: Number.MIN_VALUE,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.quasiFermiShiftEv).toBeCloseTo(37.591658987461685, 12);
  });

  it("rejects zero electron concentration", () => {
    const result = runQuasiFermiLevel({
      electronConc: 0,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_concentration",
        field: "electronConc",
      });
  });

  it("rejects zero intrinsic concentration", () => {
    const result = runQuasiFermiLevel({
      electronConc: 1e16,
      intrinsicConc: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_intrinsic_conc",
        field: "intrinsicConc",
      });
  });

  it("rejects negative concentrations through validation", () => {
    const result = runQuasiFermiLevel({
      electronConc: -1e16,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "electronConc",
      });
  });

  it("requires both concentrations", () => {
    const result = runQuasiFermiLevel({ electronConc: 1e16 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_field",
        field: "intrinsicConc",
      });
  });

  it("rejects non-numeric inputs", () => {
    const result = runQuasiFermiLevel({
      electronConc: "many",
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown input fields", () => {
    const result = runQuasiFermiLevel({
      electronConc: 1e16,
      holeConc: 1e10,
      intrinsicConc: 1e10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "unknown_field",
        field: "holeConc",
      });
  });
});
