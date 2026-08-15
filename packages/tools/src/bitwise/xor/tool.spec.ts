import { describe, expect, it } from "vitest";
import { example, runBitwiseXor } from "./tool.js";

describe("bitwise/xor", () => {
  it("executes its canonical example", () => {
    expect(runBitwiseXor(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("clears equal bit patterns", () => {
    expect(runBitwiseXor({ a: 42, b: 42 })).toEqual({
      ok: true,
      output: { result: 0 },
    });
  });
});
