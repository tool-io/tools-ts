import { describe, expect, it } from "vitest";
import { mismatchLossExample, runMismatchLoss } from "./tool.js";

describe("Mismatch Loss dB", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runMismatchLoss(mismatchLossExample.input)).toEqual({
      ok: true,
      output: mismatchLossExample.output,
    }));

  it("maps a gamma of one half to about 1.25 dB", () =>
    expect(runMismatchLoss({ reflectionCoefficient: 0.5 })).toEqual({
      ok: true,
      output: { mismatchLossDb: 1.2493873660829993 },
    }));

  it("approaches zero loss for tiny reflections", () => {
    const result = runMismatchLoss({ reflectionCoefficient: 0.001 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.mismatchLossDb).toBeLessThan(0.00001);
  });

  it("grows as the reflection coefficient approaches one", () => {
    const small = runMismatchLoss({ reflectionCoefficient: 0.2 });
    const large = runMismatchLoss({ reflectionCoefficient: 0.9 });
    expect(small.ok).toBe(true);
    expect(large.ok).toBe(true);
    if (!small.ok || !large.ok) return;
    expect(large.output.mismatchLossDb).toBeGreaterThan(
      Number(small.output.mismatchLossDb),
    );
  });

  it("rejects a gamma magnitude of exactly one", () =>
    expect(runMismatchLoss({ reflectionCoefficient: 1 })).toMatchObject({
      error: {
        issues: [
          { code: "invalid_reflection", field: "reflectionCoefficient" },
        ],
      },
      ok: false,
    }));

  it("rejects gamma magnitudes above one", () =>
    expect(runMismatchLoss({ reflectionCoefficient: -1.5 })).toMatchObject({
      error: {
        issues: [
          { code: "invalid_reflection", field: "reflectionCoefficient" },
        ],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runMismatchLoss(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
