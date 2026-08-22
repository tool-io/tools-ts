import { describe, expect, it } from "vitest";
import { vneCorrectedExample, runVneCorrected } from "./tool.js";
describe("vne corrected calculator", () => {
  it("reproduces its canonical example exactly", () => {
    const r = runVneCorrected(vneCorrectedExample.input);
    if (!r.ok) throw new Error("expected success");
    expect(r.output.vneKt).toBe(155);
  });
});
