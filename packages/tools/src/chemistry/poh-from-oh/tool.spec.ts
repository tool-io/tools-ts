import { describe, expect, it } from "vitest";
import { runPohFromOh } from "./tool.js";
describe("pOH From OH Minus", () => {
  it("calculates a valid result", () =>
    expect(runPohFromOh({ oHMolPerL: 0.01 })).toEqual({
      ok: true,
      output: { poh: 2 },
    }));
  it("rejects invalid input", () =>
    expect(runPohFromOh({ oHMolPerL: -0.01 }).ok).toBe(false));
});
