import { describe, expect, it } from "vitest";
import { runByteSwap } from "./tool.js";
describe("byte swap converter", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runByteSwap({ value: 305419896 })).toEqual({
      ok: true,
      output: { swapped: 2018915346 },
    });
  });
  it("is self-inverse", () => {
    const r1 = runByteSwap({ value: 42 });
    if (!r1.ok) throw new Error("fail");
    const r2 = runByteSwap({ value: r1.output.swapped });
    if (!r2.ok) throw new Error("fail");
    expect(r2.output.swapped).toBe(42);
  });
});
