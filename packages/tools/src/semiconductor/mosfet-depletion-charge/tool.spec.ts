import { describe, expect, it } from "vitest";
import { runMosfetDepletionCharge } from "./tool.js";
describe("mosfet depletion charge calculator", () => {
  it("returns positive charge for valid inputs", () => {
    const r = runMosfetDepletionCharge({
      dopingPerCm3: 1e17,
      surfacePotentialV: 0.6,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.depletionChargeNCm2).toBeGreaterThan(0);
  });
});
