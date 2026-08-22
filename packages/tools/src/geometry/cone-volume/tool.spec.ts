import { describe, expect, it } from "vitest";
import { runConeVolume } from "./tool.js";
describe("cone volume calculator", () => {
  it("is one-third of cylinder volume", () => {
    const cyl = Math.PI * 4 * 6;
    const r = runConeVolume({ height: 6, radius: 2 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.volume).toBeCloseTo(cyl / 3, 9);
  });
});
