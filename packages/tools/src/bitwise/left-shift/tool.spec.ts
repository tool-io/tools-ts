import { describe, expect, it } from "vitest";
import { example, runBitwiseLeftShift } from "./tool.js";

describe("bitwise/left-shift", () => {
  it("executes its canonical example", () => {
    expect(runBitwiseLeftShift(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects shifts above 31", () => {
    expect(runBitwiseLeftShift({ a: 1, shift: 32 })).toMatchObject({
      ok: false,
    });
  });
});
