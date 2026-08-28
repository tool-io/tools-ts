import { describe, expect, it } from "vitest";
import { lnaGainExample, runLnaGain } from "./tool.js";

const outputOf = (input: { vInRms: number; vOutRms: number }) => {
  const result = runLnaGain(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { lnaGainDb: number };
};

describe("LNA Gain dB", () => {
  it("reproduces the canonical example", () =>
    expect(runLnaGain(lnaGainExample.input)).toEqual({
      ok: true,
      output: { lnaGainDb: 20 },
    }));

  it("matches 20 log10 of the voltage ratio", () => {
    const { lnaGainDb } = outputOf({ vInRms: 0.02, vOutRms: 1.3 });
    expect(lnaGainDb).toBeCloseTo(20 * Math.log10(1.3 / 0.02), 12);
  });

  it("reports unity gain for equal voltages", () =>
    expect(outputOf({ vInRms: 0.5, vOutRms: 0.5 }).lnaGainDb).toBe(0));

  it("gains 20 dB per factor-of-ten ratio increase", () => {
    const ten = outputOf({ vInRms: 0.01, vOutRms: 0.1 }).lnaGainDb;
    const hundred = outputOf({ vInRms: 0.01, vOutRms: 1 }).lnaGainDb;
    expect(hundred - ten).toBeCloseTo(20, 12);
  });

  it("is invariant to common scaling of both ports", () => {
    const base = outputOf({ vInRms: 0.01, vOutRms: 0.25 }).lnaGainDb;
    const scaled = outputOf({ vInRms: 0.001, vOutRms: 0.025 }).lnaGainDb;
    expect(scaled).toBeCloseTo(base, 12);
  });

  it("rejects non-positive input voltage", () => {
    expect(runLnaGain({ vInRms: 0, vOutRms: 1 }).ok).toBe(false);
    expect(runLnaGain({ vInRms: -0.01, vOutRms: 1 }).ok).toBe(false);
  });

  it("rejects non-positive output voltage", () => {
    expect(runLnaGain({ vInRms: 1, vOutRms: 0 }).ok).toBe(false);
    expect(runLnaGain({ vInRms: 1, vOutRms: -2 }).ok).toBe(false);
  });

  it("rejects non-finite inputs", () =>
    expect(
      runLnaGain({
        vInRms: Number.POSITIVE_INFINITY,
        vOutRms: 1,
      } as unknown as { vInRms: number; vOutRms: number }).ok,
    ).toBe(false));
});
