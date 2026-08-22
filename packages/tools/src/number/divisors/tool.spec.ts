import { describe, expect, it } from "vitest";
import { runDivisors, divisorsExample } from "./tool.js";
describe("number divisors calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDivisors(divisorsExample.input)).toEqual({
      ok: true,
      output: divisorsExample.output,
    });
  });
  it("primes have exactly two divisors", () => {
    const r = runDivisors({ n: 13 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.count).toBe(2);
  });
});
