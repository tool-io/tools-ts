import { describe, expect, it } from "vitest";
import {
  calculateParityProgressionRatios,
  parityProgressionRatioExample,
  parityProgressionRatioTool,
  runParityProgressionRatio,
} from "./tool.js";

describe("parityProgressionRatioTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runParityProgressionRatio(parityProgressionRatioExample.input),
    ).toEqual({
      ok: true,
      output: parityProgressionRatioExample.output,
    });
  });

  it("forms ratios from cumulative parity counts and rejects increasing counts", () => {
    expect(
      calculateParityProgressionRatios({ womenAtParity: [80, 40, 10] }),
    ).toEqual({ progressionRatios: [0.5, 0.25] });
    const result = runParityProgressionRatio({ womenAtParity: [80, 90] });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].code).toBe("invalid_order");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(parityProgressionRatioExample))).toEqual(
      parityProgressionRatioExample,
    );
    expect(parityProgressionRatioTool.contractVersion).toBe(1);
    expect(parityProgressionRatioTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runParityProgressionRatio(null).ok).toBe(false);
    expect(
      runParityProgressionRatio({
        ...parityProgressionRatioExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
