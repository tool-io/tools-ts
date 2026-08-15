import { describe, expect, it } from "vitest";
import { example, runBitwiseOr } from "./tool.js";

describe("bitwise/or", () => {
  it("executes its canonical example", () => {
    expect(runBitwiseOr(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("combines disjoint bits", () => {
    expect(runBitwiseOr({ a: 8, b: 3 })).toEqual({
      ok: true,
      output: { result: 11 },
    });
  });
});
