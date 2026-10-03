import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredRoles: readonly string[];
  readonly assignedRoles: readonly string[];
  readonly completedRoles: readonly string[];
};
export type Output = {
  readonly covered: readonly string[];
  readonly missing: readonly string[];
  readonly completedRequired: readonly string[];
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assignedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    completedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredRoles", "assignedRoles", "completedRoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    covered: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    completedRequired: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    fraction: { type: "number" },
  },
  required: ["covered", "missing", "completedRequired", "fraction"],
} as const;
/** Audit assigned/completed role coverage against an explicit training requirement list. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredRoles, assignedRoles, completedRoles } = request;
  const compute = (): Output => {
    H.domain(
      requiredRoles.length > 0 &&
        new Set(requiredRoles).size === requiredRoles.length,
    );
    const covered = requiredRoles.filter((x) => assignedRoles.includes(x)),
      completedRequired = requiredRoles.filter(
        (x) => assignedRoles.includes(x) && completedRoles.includes(x),
      );
    return {
      covered,
      missing: requiredRoles.filter((x) => !assignedRoles.includes(x)),
      completedRequired,
      fraction: completedRequired.length / requiredRoles.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredRoles: ["A", "B", "C"],
    assignedRoles: ["A", "B"],
    completedRoles: ["B", "C"],
  },
  output: {
    covered: ["A", "B"],
    missing: ["C"],
    completedRequired: ["B"],
    fraction: 0.3333333333333333,
  },
} satisfies ToolExample<Input, Output>;
export const trainingAssignmentRoleCoverageFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/training-assignment-role-coverage-fraction",
      title: "Training Assignment Role Coverage Fraction Tool",
      description:
        "Audit assigned/completed role coverage against an explicit training requirement list.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          assignedRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          completedRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["requiredRoles", "assignedRoles", "completedRoles"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          covered: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          missing: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          completedRequired: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          fraction: { type: "number" },
        },
        required: ["covered", "missing", "completedRequired", "fraction"],
      },
      ports: {
        inputs: [
          {
            id: "requiredRoles",
            label: "Required Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "assignedRoles",
            label: "Assigned Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "completedRoles",
            label: "Completed Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "covered",
            label: "Covered",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "missing",
            label: "Missing",
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "completedRequired",
            label: "Completed Required",
            valueType: { type: "list", items: { type: "string" } },
          },
          { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = trainingAssignmentRoleCoverageFractionTool.execute;
export default trainingAssignmentRoleCoverageFractionTool;
