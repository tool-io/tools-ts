import { describe, expect, it } from "vitest";
import {
  calculateDarlingtonBeta,
  darlingtonBetaExample,
  runDarlingtonBeta,
} from "./tool.js";

describe("Darlington Beta", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDarlingtonBeta(darlingtonBetaExample.input)).toEqual({
      ok: true,
      output: darlingtonBetaExample.output,
    });
  });

  it("multiplies two equal betas", () => {
    expect(
      calculateDarlingtonBeta({ betaOneInt: 200, betaTwoInt: 200 })
        .darlingtonBeta,
    ).toBe(40000);
  });

  it("returns unity for matched betas of one", () => {
    expect(
      calculateDarlingtonBeta({ betaOneInt: 1, betaTwoInt: 1 }).darlingtonBeta,
    ).toBe(1);
  });

  it("is commutative", () => {
    expect(
      calculateDarlingtonBeta({ betaOneInt: 40, betaTwoInt: 75 })
        .darlingtonBeta,
    ).toBe(
      calculateDarlingtonBeta({ betaOneInt: 75, betaTwoInt: 40 })
        .darlingtonBeta,
    );
  });

  it("handles large realistic betas", () => {
    expect(
      calculateDarlingtonBeta({ betaOneInt: 1000, betaTwoInt: 1000 })
        .darlingtonBeta,
    ).toBe(1000000);
  });

  it("rejects a beta below one on the first stage", () => {
    expect(runDarlingtonBeta({ betaOneInt: 0, betaTwoInt: 50 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "betaOneInt" }] },
      ok: false,
    });
  });

  it("rejects a fractional second stage beta", () => {
    expect(
      runDarlingtonBeta({ betaOneInt: 100, betaTwoInt: 5.5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "betaTwoInt" }] },
      ok: false,
    });
  });
});
