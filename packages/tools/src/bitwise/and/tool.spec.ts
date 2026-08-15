import { describe, expect, it } from "vitest";
import { example, runBitwiseAnd } from "./tool.js";

describe("bitwise/and", () => {
  it("executes its canonical example", () => {
    expect(runBitwiseAnd(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("rejects operands outside signed 32-bit range", () => {
    expect(runBitwiseAnd({ a: 2147483648, b: 1 })).toMatchObject({ ok: false });
  });
});
