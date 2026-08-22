import { describe, expect, it } from "vitest";
import { runBitReversal } from "./tool.js";
describe("bit reversal calculator", () => {
  it("reverses 4-bit value 6 (0110 → 0110)", () => {
    const r = runBitReversal({ bitWidth: 4, value: 6 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.reversed).toBe(6);
  });
  it("reverses 8-bit value 1 (00000001 → 10000000)", () => {
    const r = runBitReversal({ bitWidth: 8, value: 1 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.reversed).toBe(128);
  });
});
