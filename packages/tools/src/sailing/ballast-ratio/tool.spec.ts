import { describe, expect, it } from "vitest";
import { ballastRatioExample, runBallastRatio } from "./tool.js";

describe("ballast ratio calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBallastRatio(ballastRatioExample.input)).toEqual({
      ok: true,
      output: ballastRatioExample.output,
    });
  });

  it("returns one hundred percent when ballast equals displacement", () => {
    const result = runBallastRatio({
      ballastWeightPounds: 6000,
      displacementPounds: 6000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ballastRatioPercent).toBe(100);
  });

  it("returns zero for zero ballast", () => {
    const result = runBallastRatio({
      ballastWeightPounds: 0,
      displacementPounds: 8000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ballastRatioPercent).toBe(0);
  });

  it("scales linearly with ballast weight", () => {
    const base = runBallastRatio({
      ballastWeightPounds: 1000,
      displacementPounds: 5000,
    });
    const doubled = runBallastRatio({
      ballastWeightPounds: 2000,
      displacementPounds: 5000,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.ballastRatioPercent).toBe(
      2 * (base.output.ballastRatioPercent as number),
    );
  });

  it("rejects negative ballast weight with a stable code", () => {
    expect(
      runBallastRatio({ ballastWeightPounds: -1, displacementPounds: 5000 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_ballast_weight", field: "ballastWeightPounds" },
        ],
      },
      ok: false,
    });
  });

  it("rejects ballast exceeding displacement with a stable code", () => {
    expect(
      runBallastRatio({ ballastWeightPounds: 6000, displacementPounds: 5000 }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_ballast_weight", field: "ballastWeightPounds" },
        ],
      },
      ok: false,
    });
  });

  it("rejects zero and negative displacement with a stable code", () => {
    for (const displacementPounds of [0, -5000])
      expect(
        runBallastRatio({
          ballastWeightPounds: 2000,
          displacementPounds,
        }),
      ).toMatchObject({
        error: {
          issues: [{ code: "invalid_input", field: "displacementPounds" }],
        },
        ok: false,
      });
  });

  it("rejects missing required inputs", () => {
    expect(runBallastRatio({ displacementPounds: 5000 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "ballastWeightPounds" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite inputs", () => {
    for (const bad of [
      { ballastWeightPounds: Number.NaN, displacementPounds: 5000 },
      {
        ballastWeightPounds: 2000,
        displacementPounds: Number.POSITIVE_INFINITY,
      },
    ])
      expect(runBallastRatio(bad).ok).toBe(false);
  });

  it("rejects unknown input fields", () => {
    expect(
      runBallastRatio({
        ballastWeightPounds: 4000,
        crewPounds: 300,
        displacementPounds: 10000,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "crewPounds" }] },
      ok: false,
    });
  });
});
