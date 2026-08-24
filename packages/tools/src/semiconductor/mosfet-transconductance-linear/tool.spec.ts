import { describe, expect, it } from "vitest";
import { runMosfetTransconductanceLinear } from "./tool.js";
describe("mosfet transconductance linear", () => {
  it("returns Kn times VDS", () => {
    const result = runMosfetTransconductanceLinear({
      knAPerV2: 200,
      vdsV: 0.1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.transconductanceS).toBeCloseTo(20, 6);
  });
});
