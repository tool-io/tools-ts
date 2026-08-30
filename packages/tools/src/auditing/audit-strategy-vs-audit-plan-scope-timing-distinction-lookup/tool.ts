import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AuditStrategyPlanInput = {
  readonly entityWideScope: boolean;
  readonly plannedProcedures: boolean;
  readonly timingCommunicated: boolean;
};

export type AuditStrategyPlanOutput = {
  readonly classification:
    "audit_plan" | "audit_strategy" | "insufficient_information";
  readonly rationale:
    "plan_has_procedures" | "strategy_has_entity_scope" | "scope_missing";
  readonly timingDocumented: boolean;
};

export const distinguishAuditStrategyFromPlan = (
  input: AuditStrategyPlanInput,
): AuditStrategyPlanOutput => {
  for (const field of [
    "entityWideScope",
    "plannedProcedures",
    "timingCommunicated",
  ] as const)
    if (typeof input[field] !== "boolean")
      simpleError(
        field,
        `${field} must be a boolean.`,
        "boolean_field_required",
      );
  if (input.plannedProcedures)
    return {
      classification: "audit_plan",
      rationale: "plan_has_procedures",
      timingDocumented: input.timingCommunicated,
    };
  if (input.entityWideScope)
    return {
      classification: "audit_strategy",
      rationale: "strategy_has_entity_scope",
      timingDocumented: input.timingCommunicated,
    };
  return {
    classification: "insufficient_information",
    rationale: "scope_missing",
    timingDocumented: input.timingCommunicated,
  };
};

export const auditStrategyPlanExample = {
  input: {
    entityWideScope: false,
    plannedProcedures: true,
    timingCommunicated: true,
  },
  output: {
    classification: "audit_plan",
    rationale: "plan_has_procedures",
    timingDocumented: true,
  },
} satisfies ToolExample<AuditStrategyPlanInput, AuditStrategyPlanOutput>;

export const auditStrategyPlanTool = createSimpleTool({
  calculate: (input) =>
    distinguishAuditStrategyFromPlan({
      entityWideScope: input.entityWideScope as boolean,
      plannedProcedures: input.plannedProcedures as boolean,
      timingCommunicated: input.timingCommunicated as boolean,
    }),
  description:
    "Classify supplied planning facts as an audit strategy, an audit plan, or insufficient scope information, while reporting whether timing was communicated.",
  id: "auditing/audit-strategy-vs-audit-plan-scope-timing-distinction-lookup",
  inputs: [
    {
      description:
        "Whether the planning scope covers the entity rather than one process.",
      id: "entityWideScope",
      kind: "boolean",
      label: "Entity-wide scope",
    },
    {
      description:
        "Whether process-specific planned procedures are documented.",
      id: "plannedProcedures",
      kind: "boolean",
      label: "Planned procedures documented",
    },
    {
      description: "Whether planned audit timing is documented.",
      id: "timingCommunicated",
      kind: "boolean",
      label: "Timing communicated",
    },
  ],
  outputs: [
    {
      enum: ["audit_plan", "audit_strategy", "insufficient_information"],
      id: "classification",
      kind: "string",
      label: "Planning classification",
    },
    {
      enum: [
        "plan_has_procedures",
        "strategy_has_entity_scope",
        "scope_missing",
      ],
      id: "rationale",
      kind: "string",
      label: "Classification rationale",
    },
    {
      id: "timingDocumented",
      kind: "boolean",
      label: "Timing documented",
    },
  ],
  title: "Audit Strategy vs Audit Plan Scope Timing Distinction",
});

export const runAuditStrategyPlan = auditStrategyPlanTool.execute;
export default auditStrategyPlanTool;
