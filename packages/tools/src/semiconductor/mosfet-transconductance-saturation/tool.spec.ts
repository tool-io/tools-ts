import { describe, expect, it } from "vitest";
import { runMosfetTransconductanceSaturation } from "./tool.js";
describe("mosfet transconductance saturation", () => {
  it("computes gm for Kn=200 Vov=1", () => {
    const result = runMosfetTransconductanceSaturation({
      knAPerV2: 200,
      overdriveV: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.transconductanceS).toBeCloseTo(200, 6);
  });
});
