import { describe, expect, it } from "vitest";
import { runResonanceCount } from "./tool.js";

describe("Resonance Count Tool", () => {
  it("returns the count of specified resonance structures", () => {
    expect(runResonanceCount({ structuresSpecified: 3 })).toEqual({
      ok: true,
      output: { count: 3 },
    });
  });

  it("rejects invalid input", () =>
    expect(runResonanceCount(null).ok).toBe(false));
});
