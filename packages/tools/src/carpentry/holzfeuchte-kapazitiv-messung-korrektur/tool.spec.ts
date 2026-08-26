import { describe, expect, it } from "vitest";
import {
  capacitiveCorrectionExample,
  runCapacitiveCorrection,
} from "./tool.js";

describe("Capacitive Meter Correction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCapacitiveCorrection(capacitiveCorrectionExample.input)).toEqual({
      ok: true,
      output: capacitiveCorrectionExample.output,
    });
  });

  it("defaults to a zero correction factor", () => {
    expect(runCapacitiveCorrection({ readingPercent: 12.5 })).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 12.5 },
    });
  });

  it("keeps the reading for an explicit zero correction", () => {
    expect(
      runCapacitiveCorrection({
        readingPercent: 20,
        speciesCorrectionPercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 20 },
    });
  });

  it("raises the reading for a positive correction", () => {
    expect(
      runCapacitiveCorrection({
        readingPercent: 20,
        speciesCorrectionPercent: 5,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 21 },
    });
  });

  it("applies the minus twenty percent floor", () => {
    expect(
      runCapacitiveCorrection({
        readingPercent: 25,
        speciesCorrectionPercent: -20,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 20 },
    });
  });

  it("applies the plus twenty percent ceiling", () => {
    expect(
      runCapacitiveCorrection({
        readingPercent: 10,
        speciesCorrectionPercent: 20,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 12 },
    });
  });

  it("accepts the zero and sixty reading boundaries", () => {
    expect(runCapacitiveCorrection({ readingPercent: 0 })).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 0 },
    });
    expect(runCapacitiveCorrection({ readingPercent: 60 })).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 60 },
    });
  });

  it("rejects readings above sixty percent", () => {
    const result = runCapacitiveCorrection({ readingPercent: 60.5 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects negative readings", () => {
    expect(runCapacitiveCorrection({ readingPercent: -1 }).ok).toBe(false);
  });

  it("rejects corrections beyond plus minus twenty percent", () => {
    const result = runCapacitiveCorrection({
      readingPercent: 12,
      speciesCorrectionPercent: 20.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the meter reading", () => {
    expect(runCapacitiveCorrection({}).ok).toBe(false);
  });
});
