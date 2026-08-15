import { describe, expect, it } from "vitest";
import { example, runBitwiseNot } from "./tool.js";

describe("bitwise/not", () => {
  it("executes its canonical example", () => {
    expect(runBitwiseNot(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("inverts every signed 32-bit bit", () => {
    expect(runBitwiseNot({ a: -1 })).toEqual({
      ok: true,
      output: { result: 0 },
    });
  });
});
