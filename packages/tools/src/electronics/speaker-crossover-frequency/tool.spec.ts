import { describe, expect, it } from "vitest";
import {
  speakerCrossoverFrequencyExample,
  runSpeakerCrossoverFrequency,
} from "./tool.js";

const outputOf = (input: { capacitanceUf: number; zohmsOhms: number }) => {
  const result = runSpeakerCrossoverFrequency(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { crossoverFrequencyHz: number };
};

describe("Crossover Frequency", () => {
  it("reproduces the canonical example", () =>
    expect(
      runSpeakerCrossoverFrequency(speakerCrossoverFrequencyExample.input),
    ).toEqual({
      ok: true,
      output: { crossoverFrequencyHz: 1989.436788648692 },
    }));

  it("evaluates one over two pi R C", () => {
    const { crossoverFrequencyHz } = outputOf({
      capacitanceUf: 4.7,
      zohmsOhms: 16,
    });
    expect(crossoverFrequencyHz).toBeCloseTo(
      1 / (2 * Math.PI * 16 * 4.7e-6),
      9,
    );
  });

  it("halves the corner when impedance doubles", () => {
    const base = outputOf({
      capacitanceUf: 10,
      zohmsOhms: 8,
    }).crossoverFrequencyHz;
    const heavier = outputOf({
      capacitanceUf: 10,
      zohmsOhms: 16,
    }).crossoverFrequencyHz;
    expect(heavier).toBeCloseTo(base / 2, 12);
  });

  it("halves the corner when capacitance doubles", () => {
    const base = outputOf({
      capacitanceUf: 5,
      zohmsOhms: 8,
    }).crossoverFrequencyHz;
    const bigger = outputOf({
      capacitanceUf: 10,
      zohmsOhms: 8,
    }).crossoverFrequencyHz;
    expect(bigger).toBeCloseTo(base / 2, 12);
  });

  it("is inversely proportional to the RC product", () => {
    const a = outputOf({
      capacitanceUf: 3.3,
      zohmsOhms: 4,
    }).crossoverFrequencyHz;
    const b = outputOf({
      capacitanceUf: 6.6,
      zohmsOhms: 8,
    }).crossoverFrequencyHz;
    expect(a).toBeCloseTo(b * 4, 12);
  });

  it("treats microfarads correctly against farads", () =>
    expect(
      outputOf({ capacitanceUf: 1_000_000, zohmsOhms: 1 }).crossoverFrequencyHz,
    ).toBeCloseTo(1 / (2 * Math.PI), 9));

  it("rejects non-positive impedance or capacitance", () => {
    expect(
      runSpeakerCrossoverFrequency({ capacitanceUf: 10, zohmsOhms: 0 }).ok,
    ).toBe(false);
    expect(
      runSpeakerCrossoverFrequency({ capacitanceUf: -10, zohmsOhms: 8 }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields", () =>
    expect(
      runSpeakerCrossoverFrequency({
        capacitanceUf: 10,
        zohmsOhms: 8,
        extra: "x",
      } as unknown as { capacitanceUf: number; zohmsOhms: number }).ok,
    ).toBe(false));
});
