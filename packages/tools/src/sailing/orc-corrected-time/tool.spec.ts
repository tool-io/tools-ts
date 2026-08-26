import { describe, expect, it } from "vitest";
import { orcCorrectedTimeExample, runOrcCorrectedTime } from "./tool.js";

describe("ORC Corrected Time Calculator", () => {
  it("calculates the canonical example exactly", () => {
    expect(runOrcCorrectedTime(orcCorrectedTimeExample.input)).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 3780 },
    });
  });

  it("defaults the coefficient to one when omitted", () => {
    expect(runOrcCorrectedTime({ elapsedSeconds: 7200 })).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 7200 },
    });
  });

  it("accepts the inclusive lower bound of zero point seven", () => {
    expect(
      runOrcCorrectedTime({ elapsedSeconds: 3600, orcCoefficient: 0.7 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 2520 },
    });
  });

  it("accepts the inclusive upper bound of one point four", () => {
    expect(
      runOrcCorrectedTime({ elapsedSeconds: 3600, orcCoefficient: 1.4 }),
    ).toEqual({
      ok: true,
      output: { correctedTimeSeconds: 5040 },
    });
  });

  it("applies a larger correction for a higher coefficient", () => {
    const slowRated = runOrcCorrectedTime({
      elapsedSeconds: 4000,
      orcCoefficient: 1.2,
    });
    const fastRated = runOrcCorrectedTime({
      elapsedSeconds: 4000,
      orcCoefficient: 0.8,
    });
    if (!slowRated.ok || !fastRated.ok) throw new Error("expected success");
    expect(slowRated.output.correctedTimeSeconds).toBeGreaterThan(
      Number(fastRated.output.correctedTimeSeconds),
    );
  });

  it("rejects a coefficient outside the schema bounds", () => {
    expect(
      runOrcCorrectedTime({ elapsedSeconds: 3600, orcCoefficient: 0.69 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "orcCoefficient" }] },
      ok: false,
    });
    expect(
      runOrcCorrectedTime({ elapsedSeconds: 3600, orcCoefficient: 1.41 }).ok,
    ).toBe(false);
  });

  it("rejects zero or negative elapsed time with a stable error", () => {
    expect(
      runOrcCorrectedTime({ elapsedSeconds: 0, orcCoefficient: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_input", field: "elapsedSeconds" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runOrcCorrectedTime({
        classRule: "GPH",
        elapsedSeconds: 3600,
        orcCoefficient: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "classRule" }] },
      ok: false,
    });
  });

  it("rejects null input and missing fields", () => {
    expect(runOrcCorrectedTime(null).ok).toBe(false);
    expect(runOrcCorrectedTime({}).ok).toBe(false);
  });
});
