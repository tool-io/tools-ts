import { describe, expect, it } from "vitest";
import { runConditionalFormationConstant } from "./tool.js";
describe("Conditional Kf Prime", () => {
  it("calculates a valid result", () =>
    expect(
      runConditionalFormationConstant({
        alphaFraction: 0.35,
        formationConstantBeta: 200,
      }),
    ).toEqual({
      ok: true,
      output: { conditionalFormationConstant: 70 },
    }));
  it("rejects invalid input", () =>
    expect(
      runConditionalFormationConstant({
        alphaFraction: 0.35,
        formationConstantBeta: 0,
      }).ok,
    ).toBe(false));
});
