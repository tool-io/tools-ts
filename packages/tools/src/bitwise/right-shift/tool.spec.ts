import { describe, expect, it } from "vitest";
import { example, runBitwiseRightShift } from "./tool.js";

describe("bitwise/right-shift", () => {
  it("executes its canonical example", () => {
    expect(runBitwiseRightShift(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("preserves the sign", () => {
    expect(runBitwiseRightShift({ a: -2, shift: 1 })).toEqual({
      ok: true,
      output: { result: -1 },
    });
  });
});
