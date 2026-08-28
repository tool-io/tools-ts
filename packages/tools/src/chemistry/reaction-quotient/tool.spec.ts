import { describe, expect, it } from "vitest";
import { runReactionQuotient } from "./tool.js";
describe("Reaction Quotient Q Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runReactionQuotient({
        concProduct: 0.5,
        concReactant: 2,
        exponentP: 1,
        exponentR: 1,
      }),
    ).toEqual({
      ok: true,
      output: { reactionQuotient: 0.25 },
    }));
  it("rejects invalid input", () =>
    expect(
      runReactionQuotient({
        concProduct: 0,
        concReactant: 2,
        exponentP: 1,
        exponentR: 1,
      }).ok,
    ).toBe(false));
});
