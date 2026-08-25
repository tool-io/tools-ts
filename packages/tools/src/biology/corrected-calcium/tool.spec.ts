import { describe, expect, it } from "vitest";
import { correctedCalciumExample, runCorrectedCalcium } from "./tool.js";

describe("Corrected Calcium", () => {
  it("publishes an executable example", () =>
    expect(runCorrectedCalcium(correctedCalciumExample.input)).toEqual({
      ok: true,
      output: correctedCalciumExample.output,
    }));
  it("leaves calcium unchanged at normal albumin", () =>
    expect(
      runCorrectedCalcium({ albuminGDl: 4, measuredCalciumMgDl: 9 }),
    ).toEqual({ ok: true, output: { correctedCalciumMgDl: 9 } }));
  it("corrects upward for low albumin", () =>
    expect(
      runCorrectedCalcium({ albuminGDl: 1.5, measuredCalciumMgDl: 7.6 }),
    ).toEqual({ ok: true, output: { correctedCalciumMgDl: 9.6 } }));
  it("rejects zero albumin", () => {
    const result = runCorrectedCalcium({
      albuminGDl: 0,
      measuredCalciumMgDl: 8.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_field");
  });
  it("rejects negative albumin", () => {
    const result = runCorrectedCalcium({
      albuminGDl: -2.5,
      measuredCalciumMgDl: 8.5,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects unknown fields", () => {
    const result = runCorrectedCalcium({
      albuminGDl: 2.5,
      extra: true,
      measuredCalciumMgDl: 8.5,
    });
    expect(result.ok).toBe(false);
  });
});
