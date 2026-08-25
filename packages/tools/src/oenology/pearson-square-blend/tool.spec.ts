import { describe, expect, it } from "vitest";
import {
  pearsonSquareBlendExample,
  pearsonSquareBlendTool,
  runPearsonSquareBlend,
} from "./tool.js";

describe("pearsonSquareBlendTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runPearsonSquareBlend(pearsonSquareBlendExample.input)).toEqual({
      ok: true,
      output: pearsonSquareBlendExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(pearsonSquareBlendExample))).toEqual(
      pearsonSquareBlendExample,
    );
    expect(pearsonSquareBlendTool.contractVersion).toBe(1);
    expect(pearsonSquareBlendTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPearsonSquareBlend(null).ok).toBe(false);
    expect(
      runPearsonSquareBlend({
        ...pearsonSquareBlendExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("allows a boundary target as a pure-component blend", () => {
    expect(
      runPearsonSquareBlend({ targetValue: 14, valueA: 14, valueB: 12 }),
    ).toEqual({
      ok: true,
      output: {
        fractionOfA: 1,
        fractionOfB: 0,
        partsOfA: 2,
        partsOfB: 0,
      },
    });
  });
});
