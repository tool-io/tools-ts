import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityId: string;
  readonly factorRecordId: string;
  readonly factorVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityId: { type: "string", maxLength: 8192, minLength: 1 },
    factorRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    factorVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["activityId", "factorRecordId", "factorVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit agricultural emission-factor reference by version without inventing or applying a factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityId, factorRecordId, factorVersion } = request;
  const compute = (): Output => {
    H.domain(activityId.length > 0, "activityId");
    H.domain(factorRecordId.length > 0, "factorRecordId");
    H.domain(factorVersion.length > 0, "factorVersion");
    return {
      token: JSON.stringify([activityId, factorRecordId, factorVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activityId: "A17", factorRecordId: "EF2", factorVersion: "v2" },
  output: { token: '["A17","EF2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalEmissionFactorReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "sustainable-agriculture",
          "sustainable agriculture",
          "agriculture",
        ],
        keywords: ["sustainable agriculture", "agriculture"],
      },
      id: "sustainable-agriculture/agricultural-emission-factor-reference",
      title: "Agricultural Emission Factor Reference",
      description:
        "Qualify an explicit agricultural emission-factor reference by version without inventing or applying a factor.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityId: { type: "string", maxLength: 8192, minLength: 1 },
          factorRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          factorVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["activityId", "factorRecordId", "factorVersion"],
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
            id: "activityId",
            label: "Activity Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "factorRecordId",
            label: "Factor Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "factorVersion",
            label: "Factor Version",
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
export const run = agriculturalEmissionFactorReferenceTool.execute;
export default agriculturalEmissionFactorReferenceTool;
