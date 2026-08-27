import { describe, expect, it } from "vitest";
import { adcEnobFromSinadExample, runAdcEnobFromSinad } from "./tool.js";

const outputOf = (input: { sinadDb: number }) => {
  const result = runAdcEnobFromSinad(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { enobBits: number };
};

describe("ENOB From SINAD", () => {
  it("reproduces the canonical example", () =>
    expect(runAdcEnobFromSinad(adcEnobFromSinadExample.input)).toEqual({
      ok: true,
      output: { enobBits: 10.006644518272426 },
    }));

  it("subtracts the 1.76 dB quantization floor over 6.02 dB per bit", () => {
    const { enobBits } = outputOf({ sinadDb: 74.5 });
    expect(enobBits).toBeCloseTo((74.5 - 1.76) / 6.02, 12);
  });

  it("yields one bit at the 7.78 dB SINAD point", () =>
    expect(outputOf({ sinadDb: 7.78 }).enobBits).toBeCloseTo(1, 12));

  it("gains roughly one bit per six extra decibels of SINAD", () => {
    const base = outputOf({ sinadDb: 50 }).enobBits;
    const better = outputOf({ sinadDb: 56 }).enobBits;
    expect(better - base).toBeCloseTo(6 / 6.02, 12);
  });

  it("yields zero bits at the quantization floor", () =>
    expect(outputOf({ sinadDb: 1.76 }).enobBits).toBeCloseTo(0, 12));

  it("goes negative below the quantization floor", () =>
    expect(outputOf({ sinadDb: 0 }).enobBits).toBeLessThan(0));

  it("handles large converter SINAD values", () => {
    const { enobBits } = outputOf({ sinadDb: 98 });
    expect(enobBits).toBeCloseTo((98 - 1.76) / 6.02, 12);
  });

  it("accepts negative SINAD as a valid ratio", () =>
    expect(Number.isFinite(outputOf({ sinadDb: -3.5 }).enobBits)).toBe(true));

  it("rejects non-finite SINAD", () =>
    expect(
      runAdcEnobFromSinad({
        sinadDb: Number.POSITIVE_INFINITY,
      } as unknown as { sinadDb: number }).ok,
    ).toBe(false));
});
