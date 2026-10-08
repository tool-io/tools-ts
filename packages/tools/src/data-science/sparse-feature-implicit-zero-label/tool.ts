import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly featureId: string;
  readonly suppliedZeroMeaning: string;
  readonly schemaSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    featureId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedZeroMeaning: { type: "string", maxLength: 8192, minLength: 1 },
    schemaSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["featureId", "suppliedZeroMeaning", "schemaSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit sparse-feature implicit-zero semantics and schema source without treating missing values as zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { featureId, suppliedZeroMeaning, schemaSource } = request;
  const compute = (): Output => {
    H.domain(featureId.length > 0, "featureId");
    H.domain(suppliedZeroMeaning.length > 0, "suppliedZeroMeaning");
    H.domain(schemaSource.length > 0, "schemaSource");
    return {
      token: JSON.stringify([featureId, suppliedZeroMeaning, schemaSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    featureId: "F17",
    suppliedZeroMeaning: "measured zero",
    schemaSource: "schema S4",
  },
  output: { token: '["F17","measured zero","schema S4"]' },
} satisfies ToolExample<Input, Output>;
export const sparseFeatureImplicitZeroLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "data-science/sparse-feature-implicit-zero-label",
    title: "Sparse Feature Implicit Zero Label Tool",
    description:
      "Record explicit sparse-feature implicit-zero semantics and schema source without treating missing values as zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        featureId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedZeroMeaning: { type: "string", maxLength: 8192, minLength: 1 },
        schemaSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["featureId", "suppliedZeroMeaning", "schemaSource"],
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
          id: "featureId",
          label: "Feature Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedZeroMeaning",
          label: "Supplied Zero Meaning",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "schemaSource",
          label: "Schema Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sparseFeatureImplicitZeroLabelTool.execute;
export default sparseFeatureImplicitZeroLabelTool;
