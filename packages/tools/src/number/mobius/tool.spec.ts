import { describe, expect, it } from "vitest";
import { runMobius, mobiusExample } from "./tool.js";
describe("mobius function calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMobius(mobiusExample.input)).toEqual({
      ok: true,
      output: mobiusExample.output,
    });
  });
  it("square-divisible numbers give zero and mu(1) is one", () => {
    const r12 = runMobius({ n: 12 });
    if (!r12.ok) throw new Error("expected success");
    expect(r12.output.mobiusValue).toBe(0);
    const r1 = runMobius({ n: 1 });
    if (!r1.ok) throw new Error("expected success");
    expect(r1.output.mobiusValue).toBe(1);
  });
});
