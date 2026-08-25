import { describe, expect, it } from "vitest";
import {
  ethanolYieldTheoreticalFractionCalculatorExample,
  runEthanolYieldTheoreticalFractionCalculator,
} from "./tool.js";

describe("Theoretical Ethanol Yield", () => {
  it("matches the canonical example", () =>
    expect(
      runEthanolYieldTheoreticalFractionCalculator(
        ethanolYieldTheoreticalFractionCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: ethanolYieldTheoreticalFractionCalculatorExample.output,
    }));
  it("reaches one hundred percent at stoichiometric yield", () => {
    const result = runEthanolYieldTheoreticalFractionCalculator({
      ethanolGramsActual: 7.65,
      glucoseGramsConsumed: 15,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.yieldPercentOfTheory).toBeCloseTo(100, 9);
  });
  it("halves the theoretical yield for partial conversion", () => {
    const result = runEthanolYieldTheoreticalFractionCalculator({
      ethanolGramsActual: 4,
      glucoseGramsConsumed: 20,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.yieldPercentOfTheory).toBeCloseTo(
        39.2156862745098,
        9,
      );
  });
  it("returns zero for zero ethanol", () =>
    expect(
      runEthanolYieldTheoreticalFractionCalculator({
        ethanolGramsActual: 0,
        glucoseGramsConsumed: 20,
      }),
    ).toEqual({ ok: true, output: { yieldPercentOfTheory: 0 } }));
  it("allows ethanol equal to glucose mass", () => {
    const result = runEthanolYieldTheoreticalFractionCalculator({
      ethanolGramsActual: 10,
      glucoseGramsConsumed: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.yieldPercentOfTheory).toBeCloseTo(
        (1 / 0.51) * 100,
        9,
      );
  });
  it("rejects zero glucose consumed", () => {
    const result = runEthanolYieldTheoreticalFractionCalculator({
      ethanolGramsActual: 0,
      glucoseGramsConsumed: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_masses");
  });
  it("reports measurements above theoretical yield for review", () => {
    const result = runEthanolYieldTheoreticalFractionCalculator({
      ethanolGramsActual: 21,
      glucoseGramsConsumed: 20,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.yieldPercentOfTheory).toBeCloseTo(
        (21 / 20 / 0.51) * 100,
        9,
      );
  });
  it("rejects negative ethanol masses", () =>
    expect(
      runEthanolYieldTheoreticalFractionCalculator({
        ethanolGramsActual: -1,
        glucoseGramsConsumed: 20,
      }).ok,
    ).toBe(false));
});
