import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewerRoles: readonly string[];
  readonly suppliedConflictingRoles: readonly string[];
};
export type Output = {
  readonly recusalIndicated: boolean;
  readonly matchedRoles: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewerRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedConflictingRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["reviewerRoles", "suppliedConflictingRoles"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recusalIndicated: { type: "boolean" },
    matchedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recusalIndicated", "matchedRoles"],
} as const;
/** Apply an explicit conflict-role list without selecting institutional ethics rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewerRoles, suppliedConflictingRoles } = request;
  const compute = (): Output => {
    return {
      recusalIndicated: reviewerRoles.some((x) =>
        suppliedConflictingRoles.includes(x),
      ),
      matchedRoles: [
        ...new Set(
          reviewerRoles.filter((x) => suppliedConflictingRoles.includes(x)),
        ),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reviewerRoles: ["reviewer", "sponsor"],
    suppliedConflictingRoles: ["sponsor"],
  },
  output: { recusalIndicated: true, matchedRoles: ["sponsor"] },
} satisfies ToolExample<Input, Output>;
export const reviewRoleRecusalFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/review-role-recusal-flag",
    title: "Review Role Recusal Flag Tool",
    description:
      "Apply an explicit conflict-role list without selecting institutional ethics rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewerRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedConflictingRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["reviewerRoles", "suppliedConflictingRoles"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recusalIndicated: { type: "boolean" },
        matchedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["recusalIndicated", "matchedRoles"],
    },
    ports: {
      inputs: [
        {
          id: "reviewerRoles",
          label: "Reviewer Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedConflictingRoles",
          label: "Supplied Conflicting Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "recusalIndicated",
          label: "Recusal Indicated",
          valueType: { type: "boolean" },
        },
        {
          id: "matchedRoles",
          label: "Matched Roles",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = reviewRoleRecusalFlagTool.execute;
export default reviewRoleRecusalFlagTool;
