import { describe, expect, it } from "vitest";
import { baseTransportFactorExample, calculateBaseTransportFactor, runBaseTransportFactor } from "./tool.js";

describe("bjt base transport factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBaseTransportFactor(baseTransportFactorExample.input)).toEqual({
      ok: true,
      output: baseTransportFactorExample.output,
    });
  });

  it("approaches one as the width shrinks", () => {
    expect(calculateBaseTransportFactor({ baseDiffusionLengthUm: 10, baseWidthUm: 0.1 }).alphaT).toBeCloseTo(0.99995, 9);
  });

  it("rejects diffusion length below the base width through execution", () => {
    expect(
      runBaseTransportFactor({ baseDiffusionLengthUm: 0.2, baseWidthUm: 0.5 }),
    ).toMatchObject({ error: { issues: [{ code: "transport_invalid" }] }, ok: false });
  });
});
