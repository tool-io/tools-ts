import { describe, expect, it } from "vitest";
import { runKbFromKaKw } from "./tool.js";
describe("Kb From Ka", () => {
  it("calculates a valid result", () =>
    expect(runKbFromKaKw({ ka: 1.8e-5 })).toEqual({
      ok: true,
      output: { kb: 5.555555555555555e-10 },
    }));
  it("rejects invalid input", () =>
    expect(runKbFromKaKw({ ka: 0 }).ok).toBe(false));
});
