import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cohort: readonly string[];
  readonly priorActive: readonly string[];
  readonly currentActive: readonly string[];
};
export type Output = {
  readonly retained: readonly string[];
  readonly reactivated: readonly string[];
  readonly inactive: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cohort: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    priorActive: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    currentActive: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["cohort", "priorActive", "currentActive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retained: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reactivated: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    inactive: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["retained", "reactivated", "inactive"],
} as const;
/** Classify a fixed caller-supplied cohort using explicit prior/current activity sets; prior inactivity alone does not prove a historical customer lapse. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cohort, priorActive, currentActive } = request;
  const compute = (): Output => {
    H.domain(new Set(cohort).size === cohort.length);
    const before = new Set(priorActive),
      now = new Set(currentActive);
    return {
      retained: cohort.filter((x) => before.has(x) && now.has(x)),
      reactivated: cohort.filter((x) => !before.has(x) && now.has(x)),
      inactive: cohort.filter((x) => !now.has(x)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cohort: ["A", "B", "C"],
    priorActive: ["A", "B"],
    currentActive: ["B", "C"],
  },
  output: { retained: ["B"], reactivated: ["C"], inactive: ["A"] },
} satisfies ToolExample<Input, Output>;
export const cohortRetentionReactivationBoundaryTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "business-analytics/cohort-retention-reactivation-boundary",
      title: "Cohort Retention Reactivation Boundary Tool",
      description:
        "Classify a fixed caller-supplied cohort using explicit prior/current activity sets; prior inactivity alone does not prove a historical customer lapse.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cohort: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          priorActive: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          currentActive: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["cohort", "priorActive", "currentActive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retained: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          reactivated: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          inactive: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["retained", "reactivated", "inactive"],
      },
      ports: {
        inputs: [
          {
            id: "cohort",
            label: "Cohort",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "priorActive",
            label: "Prior Active",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "currentActive",
            label: "Current Active",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "retained",
            label: "Retained",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "reactivated",
            label: "Reactivated",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "inactive",
            label: "Inactive",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = cohortRetentionReactivationBoundaryTool.execute;
export default cohortRetentionReactivationBoundaryTool;
