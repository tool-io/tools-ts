import { describe, expect, it } from "vitest";
import { runRoundHalfToEven } from "./tool.js";
describe("round half to even calculator", () => {
  it("rounds 2.5 down to 2 at zero decimals", () => {
    const r = runRoundHalfToEven({ decimals: 0, value: 2.5 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.rounded).toBe(2);
  });
  it("rounds 3.5 up to 4 at zero decimals", () => {
    const r = runRoundHalfToEven({ decimals: 0, value: 3.5 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.rounded).toBe(4);
  });
});
