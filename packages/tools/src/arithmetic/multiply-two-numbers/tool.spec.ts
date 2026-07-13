import { describe, expect, it } from "vitest";
import { runMultiplyTwoNumbers } from "./tool.js";

describe("Multiply Two Numbers Calculator", () => {
  it("multiplies two values", () =>
    expect(runMultiplyTwoNumbers({ first: -2.5, second: 4 })).toEqual({
      ok: true,
      output: { product: -10 },
    }));

  it("rejects an overflowing product", () =>
    expect(
      runMultiplyTwoNumbers({ first: Number.MAX_VALUE, second: 2 }).ok,
    ).toBe(false));
});
