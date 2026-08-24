import { describe, expect, it } from "vitest";
import {
  majusculeMinusculeBalanceCalculatorExample,
  runMajusculeMinusculeBalanceCalculator,
} from "./tool.js";

describe("majuscule-minuscule-balance-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMajusculeMinusculeBalanceCalculator(
        majusculeMinusculeBalanceCalculatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: majusculeMinusculeBalanceCalculatorExample.output,
    });
  });

  it("calls an even display line balanced", () => {
    const result = runMajusculeMinusculeBalanceCalculator({ text: "AB ab" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.balanceVerdict).toBe("balanced");
    expect(result.output.majusculeSharePct as number).toBe(50);
  });

  it("rejects text without any cased letter", () => {
    expect(runMajusculeMinusculeBalanceCalculator({ text: "1234 !!" }).ok).toBe(
      false,
    );
  });
});
