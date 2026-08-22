import { describe, expect, it } from "vitest";
import { runNextPrime, nextPrimeExample } from "./tool.js";
describe("next prime calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNextPrime(nextPrimeExample.input)).toEqual({
      ok: true,
      output: nextPrimeExample.output,
    });
  });
  it("skips composites in the gap after seven", () => {
    const r = runNextPrime({ n: 7 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.nextPrime).toBe(11);
  });
});
