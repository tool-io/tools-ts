import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roles: readonly string[];
  readonly requiredRoles: readonly string[];
  readonly minimumCounts: readonly number[];
};
export type Output = {
  readonly counts: readonly number[];
  readonly meets: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    minimumCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["roles", "requiredRoles", "minimumCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    meets: { type: "boolean" },
  },
  required: ["counts", "meets"],
} as const;
/** Count supplied attendee-role tokens against caller-supplied minimum counts, without selecting committee rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roles, requiredRoles, minimumCounts } = request;
  const compute = (): Output => {
    H.sameLength(requiredRoles, minimumCounts);
    H.domain(
      new Set(requiredRoles).size === requiredRoles.length &&
        minimumCounts.every((x) => x >= 0),
    );
    const counts = requiredRoles.map(
      (r) => roles.filter((x) => x === r).length,
    );
    return { counts, meets: counts.every((x, i) => x >= minimumCounts[i]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roles: ["scientist", "lay", "scientist"],
    requiredRoles: ["scientist", "lay"],
    minimumCounts: [2, 1],
  },
  output: { counts: [2, 1], meets: true },
} satisfies ToolExample<Input, Output>;
export const ethicsReviewQuorumExplicitRoleCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/ethics-review-quorum-explicit-role-count",
      title: "Ethics Review Quorum Explicit Role Count Tool",
      description:
        "Count supplied attendee-role tokens against caller-supplied minimum counts, without selecting committee rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          roles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          requiredRoles: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          minimumCounts: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["roles", "requiredRoles", "minimumCounts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          counts: { type: "array", maxItems: 256, items: { type: "integer" } },
          meets: { type: "boolean" },
        },
        required: ["counts", "meets"],
      },
      ports: {
        inputs: [
          {
            id: "roles",
            label: "Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "requiredRoles",
            label: "Required Roles",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "minimumCounts",
            label: "Minimum Counts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "counts",
            label: "Counts",
            valueType: { type: "list", items: { type: "integer" } },
          },
          { id: "meets", label: "Meets", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = ethicsReviewQuorumExplicitRoleCountTool.execute;
export default ethicsReviewQuorumExplicitRoleCountTool;
