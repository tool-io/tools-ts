import { describe, expect, it } from "vitest";
import {
  calculateS80S20Ratio,
  s80S20RatioExample,
  s80S20RatioTool,
  runS80S20Ratio,
} from "./tool.js";

describe("s80S20RatioTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runS80S20Ratio(s80S20RatioExample.input)).toEqual({
      ok: true,
      output: s80S20RatioExample.output,
    });
  });

  it("compares equal-sized top and bottom fifths", () => {
    expect(calculateS80S20Ratio({ incomes: [1, 2, 3, 4, 5] })).toEqual({
      s80S20Ratio: 5,
    });
    const result = runS80S20Ratio({ incomes: [0, 1, 2, 3, 4] });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("incomes");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(s80S20RatioExample))).toEqual(
      s80S20RatioExample,
    );
    expect(s80S20RatioTool.contractVersion).toBe(1);
    expect(s80S20RatioTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runS80S20Ratio(null).ok).toBe(false);
    expect(
      runS80S20Ratio({ ...s80S20RatioExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
