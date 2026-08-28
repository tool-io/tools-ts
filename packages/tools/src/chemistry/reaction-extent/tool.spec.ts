import { describe, expect, it } from "vitest";
import { runReactionExtent } from "./tool.js";

describe("Reaction Extent Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runReactionExtent({ coefficient: 2, initialMoles: 4, remainingMoles: 2 }),
    ).toEqual({ ok: true, output: { extentMol: 1 } });
  });

  it("rejects invalid input", () =>
    expect(runReactionExtent(null).ok).toBe(false));
});
