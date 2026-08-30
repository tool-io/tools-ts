import { describe, expect, it } from "vitest";
import {
  assumptionAttackExample,
  generateAssumptionAttackProtocol,
  runAssumptionAttack,
} from "./tool.js";

describe("red-team assumption attack protocol", () => {
  it("reproduces its canonical example", () => {
    expect(runAssumptionAttack(assumptionAttackExample.input)).toEqual({
      ok: true,
      output: assumptionAttackExample.output,
    });
  });

  it("crosses every assumption with every attack mode", () => {
    expect(
      generateAssumptionAttackProtocol({
        assumptions: ["A", "B", "C"],
        attackModes: ["invert"],
      }).attackCount,
    ).toBe(3);
  });

  it("normalizes attack mode casing", () => {
    expect(
      generateAssumptionAttackProtocol({
        assumptions: ["A"],
        attackModes: [" STRESS "],
      }).attackPrompts[0],
    ).toContain("stress:");
  });

  it("rejects an unsupported attack mode", () => {
    expect(
      runAssumptionAttack({ assumptions: ["A"], attackModes: ["assume"] }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_attack_mode", field: "attackModes.0" }],
      },
      ok: false,
    });
  });
});
