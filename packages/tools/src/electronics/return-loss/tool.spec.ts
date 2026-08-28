import { describe, expect, it } from "vitest";
import { returnLossExample, runReturnLoss } from "./tool.js";

describe("Return Loss dB", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runReturnLoss(returnLossExample.input)).toEqual({
      ok: true,
      output: returnLossExample.output,
    }));

  it("maps a gamma of one half to six dB of return loss", () =>
    expect(runReturnLoss({ reflectionCoefficient: 0.5 })).toEqual({
      ok: true,
      output: { returnLossDb: 6.020599913279624 },
    }));

  it("uses the magnitude for negative gamma values", () =>
    expect(runReturnLoss({ reflectionCoefficient: -0.5 })).toEqual({
      ok: true,
      output: { returnLossDb: 6.020599913279624 },
    }));

  it("grows without bound as the load approaches a match", () => {
    const small = runReturnLoss({ reflectionCoefficient: 0.01 });
    expect(small).toEqual({ ok: true, output: { returnLossDb: 40 } });
  });

  it("decreases as the reflection coefficient grows", () => {
    const modest = runReturnLoss({ reflectionCoefficient: 0.2 });
    const large = runReturnLoss({ reflectionCoefficient: 0.8 });
    expect(modest.ok).toBe(true);
    expect(large.ok).toBe(true);
    if (!modest.ok || !large.ok) return;
    expect(Number(large.output.returnLossDb)).toBeLessThan(
      Number(modest.output.returnLossDb),
    );
  });

  it("rejects zero reflection with a degenerate input error", () =>
    expect(runReturnLoss({ reflectionCoefficient: 0 })).toMatchObject({
      error: {
        issues: [{ code: "degenerate_input", field: "reflectionCoefficient" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runReturnLoss({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "reflectionCoefficient" }],
      },
      ok: false,
    }));
});
