import { describe, expect, it } from "vitest";
import {
  runStoneFaceAreaCalculator,
  stoneFaceAreaCalculatorExample,
} from "./tool.js";

describe("stone-face-area-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStoneFaceAreaCalculator(stoneFaceAreaCalculatorExample.input),
    ).toEqual({
      ok: true,
      output: stoneFaceAreaCalculatorExample.output,
    });
  });

  it("computes a square decimetre face", () => {
    const result = runStoneFaceAreaCalculator({ widthCm: 10, heightCm: 10 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.areaCm2 as number).toBe(100);
    expect(result.output.areaM2 as number).toBe(0.01);
  });

  it("rejects a zero width", () => {
    expect(runStoneFaceAreaCalculator({ widthCm: 0, heightCm: 10 }).ok).toBe(
      false,
    );
  });
});
