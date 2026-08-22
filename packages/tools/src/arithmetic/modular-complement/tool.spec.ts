import { describe, expect, it } from "vitest";
import { runModularComplement } from "./tool.js";
describe("modular complement calculator", () => {
  it("computes complement of 3 mod 10 as 7", () => {
    const r = runModularComplement({ modulus: 10, value: 3 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.complement).toBe(7);
  });
  it("returns zero when value is a multiple of modulus", () => {
    const r = runModularComplement({ modulus: 5, value: 10 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.complement).toBe(0);
  });
});
