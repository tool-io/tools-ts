import { describe, expect, it } from "vitest";
import {
  auditStrategyPlanExample,
  distinguishAuditStrategyFromPlan,
  runAuditStrategyPlan,
} from "./tool.js";

describe("audit strategy versus audit plan distinction", () => {
  it("reproduces its canonical example", () => {
    expect(runAuditStrategyPlan(auditStrategyPlanExample.input)).toEqual({
      ok: true,
      output: auditStrategyPlanExample.output,
    });
  });

  it("identifies entity-wide strategy facts", () => {
    expect(
      distinguishAuditStrategyFromPlan({
        entityWideScope: true,
        plannedProcedures: false,
        timingCommunicated: false,
      }),
    ).toEqual({
      classification: "audit_strategy",
      rationale: "strategy_has_entity_scope",
      timingDocumented: false,
    });
  });

  it("returns insufficient information without scope or procedures", () => {
    expect(
      distinguishAuditStrategyFromPlan({
        entityWideScope: false,
        plannedProcedures: false,
        timingCommunicated: true,
      }).classification,
    ).toBe("insufficient_information");
  });

  it("rejects a non-boolean planning fact", () => {
    expect(
      runAuditStrategyPlan({
        entityWideScope: 1,
        plannedProcedures: true,
        timingCommunicated: true,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "entityWideScope" }],
      },
      ok: false,
    });
  });
});
