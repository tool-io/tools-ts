import { describe, expect, it } from "vitest";
import { runEquivalentMoles } from "./tool.js";

describe("Equivalent Moles Calculator", () => {
  it("calculates a valid result", () => {
    expect(runEquivalentMoles({ moles: 0.25, valence: 3 })).toEqual({
      ok: true,
      output: { equivalents: 0.75 },
    });
  });

  it("rejects invalid input", () =>
    expect(runEquivalentMoles(null).ok).toBe(false));
});
