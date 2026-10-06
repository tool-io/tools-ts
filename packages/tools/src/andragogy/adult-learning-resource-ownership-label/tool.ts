import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceId: string;
  readonly ownerId: string;
  readonly rightsSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceId: { type: "string", maxLength: 8192, minLength: 1 },
    ownerId: { type: "string", maxLength: 8192, minLength: 1 },
    rightsSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resourceId", "ownerId", "rightsSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an adult-learning resource owner and supplied rights source without establishing legal ownership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceId, ownerId, rightsSource } = request;
  const compute = (): Output => {
    H.domain(resourceId.length > 0, "resourceId");
    H.domain(ownerId.length > 0, "ownerId");
    H.domain(rightsSource.length > 0, "rightsSource");
    return { token: JSON.stringify([resourceId, ownerId, rightsSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resourceId: "R17",
    ownerId: "O4",
    rightsSource: "license record L2",
  },
  output: { token: '["R17","O4","license record L2"]' },
} satisfies ToolExample<Input, Output>;
export const adultLearningResourceOwnershipLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["andragogy", "education"],
        keywords: ["andragogy", "education"],
      },
      id: "andragogy/adult-learning-resource-ownership-label",
      title: "Adult Learning Resource Ownership Label",
      description:
        "Record an adult-learning resource owner and supplied rights source without establishing legal ownership.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resourceId: { type: "string", maxLength: 8192, minLength: 1 },
          ownerId: { type: "string", maxLength: 8192, minLength: 1 },
          rightsSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["resourceId", "ownerId", "rightsSource"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "resourceId",
            label: "Resource Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "ownerId",
            label: "Owner Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "rightsSource",
            label: "Rights Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = adultLearningResourceOwnershipLabelTool.execute;
export default adultLearningResourceOwnershipLabelTool;
