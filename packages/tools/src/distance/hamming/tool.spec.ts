import { describe, expect, it } from "vitest";
import { runHamming } from "./tool.js";
describe("Hamming Distance Calculator", () => {
  it("calculates a valid result", () => {
    expect(runHamming({ first: "karolin", second: "kathrin" })).toEqual({
      ok: true,
      output: { distance: 3 },
    });
  });
  it("rejects invalid input", () =>
    expect(runHamming({ first: "a", second: "bb" }).ok).toBe(false));
});
