import { describe, expect, it } from "vitest";
import { runKaFromKbKw } from "./tool.js";
describe("Ka From Kb", () => {
  it("calculates a valid result", () =>
    expect(runKaFromKbKw({ kb: 1.8e-5 })).toEqual({
      ok: true,
      output: { ka: 5.555555555555555e-10 },
    }));
  it("rejects invalid input", () =>
    expect(runKaFromKbKw({ kb: -1.8e-5 }).ok).toBe(false));
});
