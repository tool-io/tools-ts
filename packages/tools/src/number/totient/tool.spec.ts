import { describe, expect, it } from "vitest";
import { runTotient, totientExample } from "./tool.js";
describe("euler totient calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTotient(totientExample.input)).toEqual({
      ok: true,
      output: totientExample.output,
    });
  });
  it("returns 1 for n=1 and φ(p)=p−1 for primes", () => {
    expect(runTotient({ n: 1 })).toEqual({ ok: true, output: { totient: 1 } });
    const r = runTotient({ n: 7 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.totient).toBe(6);
  });
});
