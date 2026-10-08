import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly suppliedMeshText: string;
  readonly exclusionConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMeshText: { type: "string", maxLength: 8192, minLength: 1 },
    exclusionConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "suppliedMeshText", "exclusionConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit decomposition mesh and exclusion-convention metadata without inferring organism access or decomposition effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, suppliedMeshText, exclusionConvention } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(suppliedMeshText.length > 0, "suppliedMeshText");
    H.domain(exclusionConvention.length > 0, "exclusionConvention");
    return {
      token: JSON.stringify([sampleId, suppliedMeshText, exclusionConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    suppliedMeshText: "2 mm",
    exclusionConvention: "macrofauna access",
  },
  output: { token: '["S17","2 mm","macrofauna access"]' },
} satisfies ToolExample<Input, Output>;
export const decompositionMeshExclusionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/decomposition-mesh-exclusion-label",
    title: "Decomposition Mesh Exclusion Label Tool",
    description:
      "Preserve explicit decomposition mesh and exclusion-convention metadata without inferring organism access or decomposition effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedMeshText: { type: "string", maxLength: 8192, minLength: 1 },
        exclusionConvention: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "suppliedMeshText", "exclusionConvention"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMeshText",
          label: "Supplied Mesh Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exclusionConvention",
          label: "Exclusion Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = decompositionMeshExclusionLabelTool.execute;
export default decompositionMeshExclusionLabelTool;
