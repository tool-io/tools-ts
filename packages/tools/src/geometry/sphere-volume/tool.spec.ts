import { describe, expect, it } from "vitest";
import { runSphereVolume } from "./tool.js";
describe("sphere volume calculator", () => {
  it("computes volume for r=3", () => {
    const r = runSphereVolume({ radius: 3 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.volume).toBeCloseTo((4 / 3) * Math.PI * 27, 9);
  });
});
