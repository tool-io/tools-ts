import { describe, expect, it } from "vitest";
import { knotsToKphExample as example, runKnotsToKph } from "./tool.js";
describe("knots to kilometers per hour", () => {
  it("uses the exact 1.852 factor", () =>
    expect(runKnotsToKph(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("accepts zero and rejects negative speed", () => {
    expect(runKnotsToKph({ knots: 0 })).toEqual({
      ok: true,
      output: { kilometersPerHour: 0 },
    });
    expect(runKnotsToKph({ knots: -1 }).ok).toBe(false);
  });
});
