import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly referenceId: string;
  readonly normalizationConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    normalizationConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "referenceId", "normalizationConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit research antibody-binding normalization reference and convention without estimating affinity or specificity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, referenceId, normalizationConvention } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(normalizationConvention.length > 0, "normalizationConvention");
    return {
      token: JSON.stringify([assayId, referenceId, normalizationConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assayId: "A17",
    referenceId: "R4",
    normalizationConvention: "reference well",
  },
  output: { token: '["A17","R4","reference well"]' },
} satisfies ToolExample<Input, Output>;
export const researchAntibodyBindingNormalizationReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/research-antibody-binding-normalization-reference",
      title: "Research Antibody Binding Normalization Reference Tool",
      description:
        "Preserve an explicit research antibody-binding normalization reference and convention without estimating affinity or specificity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assayId: { type: "string", maxLength: 8192, minLength: 1 },
          referenceId: { type: "string", maxLength: 8192, minLength: 1 },
          normalizationConvention: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["assayId", "referenceId", "normalizationConvention"],
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
            id: "assayId",
            label: "Assay Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "referenceId",
            label: "Reference Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "normalizationConvention",
            label: "Normalization Convention",
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
export const run = researchAntibodyBindingNormalizationReferenceTool.execute;
export default researchAntibodyBindingNormalizationReferenceTool;
