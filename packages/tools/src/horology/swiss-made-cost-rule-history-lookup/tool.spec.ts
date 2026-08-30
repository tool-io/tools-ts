import { describe, expect, it } from "vitest";
import {
  lookupSwissMadeCostRuleHistory,
  runSwissMadeRule,
  swissMadeRuleExample,
} from "./tool.js";

describe("Swiss Made cost-rule history lookup", () => {
  it("reproduces the canonical complete-watch rule", () => {
    expect(runSwissMadeRule(swissMadeRuleExample.input)).toEqual({
      ok: true,
      output: swissMadeRuleExample.output,
    });
  });

  it("keeps the movement component-value rule at 50 percent", () => {
    expect(
      lookupSwissMadeCostRuleHistory({ ruleFocus: "movementComponents" })
        .verifiedRule,
    ).toContain("half");
  });

  it("keeps the movement manufacturing-cost rule at 60 percent", () => {
    expect(
      lookupSwissMadeCostRuleHistory({ ruleFocus: "movementCost" })
        .verifiedRule,
    ).toContain("60 percent");
  });

  it("rejects the proposed universal 51-percent threshold", () => {
    expect(
      lookupSwissMadeCostRuleHistory({ ruleFocus: "fiftyOnePercent" }).keyDate,
    ).toBe("not the published rule");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runSwissMadeRule({ ruleFocus: "assembly" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ruleFocus" }] },
      ok: false,
    });
  });
});
