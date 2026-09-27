import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roles: readonly string[];
  readonly times: readonly number[];
  readonly expectedOrder: readonly string[];
};
export type Output = {
  readonly unknownRoles: readonly string[];
  readonly reversedOrderIndices: readonly number[];
  readonly reversedTimeIndices: readonly number[];
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
    times: { type: "array", maxItems: 256, items: { type: "number" } },
    expectedOrder: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["roles", "times", "expectedOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unknownRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    reversedOrderIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    reversedTimeIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["unknownRoles", "reversedOrderIndices", "reversedTimeIndices"],
} as const;
/** Audit supplied signature-role ordering separately from timestamp ordering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roles, times, expectedOrder } = request;
  const compute = (): Output => {
    H.sameLength(roles, times);
    const ranks = roles.map((x) => expectedOrder.indexOf(x));
    return {
      unknownRoles: [...new Set(roles.filter((_, i) => ranks[i] < 0))],
      reversedOrderIndices: ranks.flatMap((x, i) =>
        i > 0 && x >= 0 && ranks[i - 1] >= 0 && x < ranks[i - 1] ? [i] : [],
      ),
      reversedTimeIndices: times.flatMap((x, i) =>
        i > 0 && x < times[i - 1] ? [i] : [],
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roles: ["reviewer", "author"],
    times: [100, 99],
    expectedOrder: ["author", "reviewer"],
  },
  output: {
    unknownRoles: [],
    reversedOrderIndices: [1],
    reversedTimeIndices: [1],
  },
} satisfies ToolExample<Input, Output>;
export const gcpSignatureRoleSequenceCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gcp/gcp-signature-role-sequence-check",
    title: "GCP Signature Role Sequence Check Tool",
    description:
      "Audit supplied signature-role ordering separately from timestamp ordering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        times: { type: "array", maxItems: 256, items: { type: "number" } },
        expectedOrder: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["roles", "times", "expectedOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unknownRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        reversedOrderIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        reversedTimeIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["unknownRoles", "reversedOrderIndices", "reversedTimeIndices"],
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
          id: "times",
          label: "Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "expectedOrder",
          label: "Expected Order",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "unknownRoles",
          label: "Unknown Roles",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "reversedOrderIndices",
          label: "Reversed Order Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "reversedTimeIndices",
          label: "Reversed Time Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = gcpSignatureRoleSequenceCheckTool.execute;
export default gcpSignatureRoleSequenceCheckTool;
