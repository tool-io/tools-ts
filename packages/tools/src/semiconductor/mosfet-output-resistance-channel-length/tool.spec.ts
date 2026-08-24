import { describe, expect, it } from "vitest";
import { runMosfetOutputResistance } from "./tool.js";
describe("mosfet output resistance", () => {
  it("computes ro = 1/(lambda*Id)", () => {
    const r = runMosfetOutputResistance({
      drainCurrentMa: 1,
      lambdaPerV: 0.02,
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.outputResistanceKohm).toBeCloseTo(50, 6);
  });
});
