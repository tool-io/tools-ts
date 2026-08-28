import { describe, expect, it } from "vitest";
import { runNernstEquation } from "./tool.js";
describe("Nernst Equation Calculator", () => {
  it("calculates a valid result", () =>
    expect(
      runNernstEquation({
        eStandard: 1.1,
        electronCount: 2,
        reactionQuotient: 1,
      }),
    ).toEqual({
      ok: true,
      output: { cellPotentialVolts: 1.1 },
    }));
  it("rejects invalid input", () =>
    expect(
      runNernstEquation({
        eStandard: 1.1,
        electronCount: 2,
        reactionQuotient: 0,
      }).ok,
    ).toBe(false));
});
