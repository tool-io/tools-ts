import { describe, expect, it } from "vitest";
import { moistureCorrectionExample, runMoistureCorrection } from "./tool.js";

describe("moisture meter correction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMoistureCorrection(moistureCorrectionExample.input)).toEqual({
      ok: true,
      output: moistureCorrectionExample.output,
    });
  });

  it("defaults to a zero correction", () => {
    expect(runMoistureCorrection({ measuredMoisturePercent: 12.5 })).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 12.5 },
    });
  });

  it("keeps the reading for an explicit zero correction", () => {
    expect(
      runMoistureCorrection({
        measuredMoisturePercent: 8,
        speciesCorrectionPercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 8 },
    });
  });

  it("accepts the zero measured boundary", () => {
    expect(runMoistureCorrection({ measuredMoisturePercent: 0 })).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 0 },
    });
  });

  it("accepts the one hundred measured boundary", () => {
    expect(
      runMoistureCorrection({
        measuredMoisturePercent: 100,
        speciesCorrectionPercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 100 },
    });
  });

  it("adds the positive five percent ceiling", () => {
    expect(
      runMoistureCorrection({
        measuredMoisturePercent: 20,
        speciesCorrectionPercent: 5,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 25 },
    });
  });

  it("subtracts the negative five percent floor", () => {
    expect(
      runMoistureCorrection({
        measuredMoisturePercent: 20,
        speciesCorrectionPercent: -5,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 15 },
    });
  });

  it("allows corrected values beyond the measurement range", () => {
    expect(
      runMoistureCorrection({
        measuredMoisturePercent: 98,
        speciesCorrectionPercent: 5,
      }),
    ).toEqual({
      ok: true,
      output: { correctedMoisturePercent: 103 },
    });
  });

  it("rejects readings above one hundred", () => {
    const result = runMoistureCorrection({
      measuredMoisturePercent: 100.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects negative readings", () => {
    expect(runMoistureCorrection({ measuredMoisturePercent: -0.5 }).ok).toBe(
      false,
    );
  });

  it("rejects corrections outside plus minus five", () => {
    const result = runMoistureCorrection({
      measuredMoisturePercent: 12,
      speciesCorrectionPercent: 5.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("requires the measured reading", () => {
    expect(runMoistureCorrection({}).ok).toBe(false);
  });
});
