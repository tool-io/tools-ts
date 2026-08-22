import { describe, expect, it } from "vitest";
import { runAliquotSum, aliquotSumExample } from "./tool.js";
describe("aliquot sum calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAliquotSum(aliquotSumExample.input)).toEqual({
      ok: true,
      output: aliquotSumExample.output,
    });
  });
  it("returns 0 for prime numbers", () => {
    const r = runAliquotSum({ n: 7 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.aliquotSum).toBe(1);
  });
});
