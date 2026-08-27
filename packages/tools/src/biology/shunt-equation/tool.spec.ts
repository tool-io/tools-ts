import { describe, expect, it } from "vitest";
import { runShuntEquation, shuntEquationExample } from "./tool.js";

describe("Classic Shunt Equation", () => {
  it("publishes an executable example", () =>
    expect(runShuntEquation(shuntEquationExample.input)).toEqual({
      ok: true,
      output: shuntEquationExample.output,
    }));
  it("returns zero when arterial equals end-capillary content", () =>
    expect(
      runShuntEquation({ caO2MlDl: 20, ccO2MlDl: 20, cvO2MlDl: 15 }),
    ).toEqual({ ok: true, output: { shuntFraction: 0 } }));
  it("returns one for full right-to-left shunting", () =>
    expect(
      runShuntEquation({ caO2MlDl: 15, ccO2MlDl: 20, cvO2MlDl: 15 }),
    ).toEqual({ ok: true, output: { shuntFraction: 1 } }));
  it("keeps fractional fractions", () =>
    expect(
      runShuntEquation({ caO2MlDl: 18.5, ccO2MlDl: 20, cvO2MlDl: 15 }),
    ).toEqual({ ok: true, output: { shuntFraction: 0.3 } }));
  it("rejects identical end-capillary and venous contents", () => {
    const result = runShuntEquation({
      caO2MlDl: 19,
      ccO2MlDl: 20,
      cvO2MlDl: 20,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("equal_contents");
  });
  it("rejects non-finite content values", () =>
    expect(
      runShuntEquation({
        caO2MlDl: Number.POSITIVE_INFINITY,
        ccO2MlDl: 20,
        cvO2MlDl: 15,
      }).ok,
    ).toBe(false));
});
