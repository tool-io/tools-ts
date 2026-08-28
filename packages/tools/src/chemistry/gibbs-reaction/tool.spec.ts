import { describe, expect, it } from "vitest";
import { runGibbsReaction } from "./tool.js";
describe("Gibbs Reaction Calculator", () => {
  it("products minus reactants", () => {
    expect(
      runGibbsReaction({
        productGibbsKJPerMol: [-394.4, -237.1],
        reactantGibbsKJPerMol: [-50.8],
      }),
    ).toEqual({
      ok: true,
      output: { reactionGibbsKJPerMol: -580.7 },
    });
  });
  it("rejects invalid input", () =>
    expect(runGibbsReaction(null).ok).toBe(false));
});
