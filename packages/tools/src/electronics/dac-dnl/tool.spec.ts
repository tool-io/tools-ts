import { describe, expect, it } from "vitest";
import { dacDnlExample, runDacDnl } from "./tool.js";

const outputOf = (input: {
  actualStepVolts: number;
  idealStepVolts: number;
}) => {
  const result = runDacDnl(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { dnlLsb: number };
};

describe("DAC DNL LSB", () => {
  it("reproduces the canonical example", () =>
    expect(runDacDnl(dacDnlExample.input)).toEqual({
      ok: true,
      output: { dnlLsb: 0.10000000000000005 },
    }));

  it("normalizes the step error by the ideal step", () => {
    const { dnlLsb } = outputOf({
      actualStepVolts: 0.00093,
      idealStepVolts: 0.00075,
    });
    expect(dnlLsb).toBeCloseTo((0.00093 - 0.00075) / 0.00075, 9);
  });

  it("reports zero DNL for perfectly uniform steps", () =>
    expect(
      outputOf({ actualStepVolts: 0.5, idealStepVolts: 0.5 }).dnlLsb,
    ).toBeCloseTo(0, 12));

  it("returns negative DNL for shrunken steps", () =>
    expect(
      outputOf({ actualStepVolts: 0.0009, idealStepVolts: 0.001 }).dnlLsb,
    ).toBeCloseTo(-0.1, 9));

  it("returns minus one for a missing code transition", () =>
    expect(outputOf({ actualStepVolts: 0, idealStepVolts: 0.001 }).dnlLsb).toBe(
      -1,
    ));

  it("doubles magnitude when the error doubles", () => {
    const small = outputOf({
      actualStepVolts: 0.0012,
      idealStepVolts: 0.001,
    }).dnlLsb;
    const large = outputOf({
      actualStepVolts: 0.0014,
      idealStepVolts: 0.001,
    }).dnlLsb;
    expect(large).toBeCloseTo(small * 2, 12);
  });

  it("rejects non-positive ideal steps", () => {
    expect(runDacDnl({ actualStepVolts: 0.001, idealStepVolts: 0 }).ok).toBe(
      false,
    );
    expect(
      runDacDnl({ actualStepVolts: 0.001, idealStepVolts: -0.001 }).ok,
    ).toBe(false);
  });

  it("rejects negative actual steps but accepts zero", () => {
    expect(
      runDacDnl({ actualStepVolts: -0.001, idealStepVolts: 0.001 }).ok,
    ).toBe(false);
    expect(runDacDnl({ actualStepVolts: 0, idealStepVolts: 0.001 }).ok).toBe(
      true,
    );
  });
});
