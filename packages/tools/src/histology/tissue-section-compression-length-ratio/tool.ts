import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sectionLength: number;
  readonly referenceTissueLength: number;
};
export type Output = {
  readonly lengthRatio: number;
  readonly fractionalShortening: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sectionLength: { type: "number", minimum: 0 },
    referenceTissueLength: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sectionLength", "referenceTissueLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lengthRatio: { type: "number" },
    fractionalShortening: { type: "number" },
  },
  required: ["lengthRatio", "fractionalShortening"],
} as const;
/** Compare supplied section and positive reference tissue lengths, preserving negative shortening for expansion without diagnostic interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sectionLength, referenceTissueLength } = request;
  const compute = (): Output => {
    H.domain(sectionLength >= 0, "sectionLength");
    (H.domain(
      Number.isFinite(referenceTissueLength) && referenceTissueLength > 0,
      "referenceTissueLength",
    ),
      referenceTissueLength);
    return {
      lengthRatio: sectionLength / referenceTissueLength,
      fractionalShortening: 1 - sectionLength / referenceTissueLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sectionLength: 8, referenceTissueLength: 10 },
  output: { lengthRatio: 0.8, fractionalShortening: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const tissueSectionCompressionLengthRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "histology/tissue-section-compression-length-ratio",
      title: "Tissue Section Compression Length Ratio Tool",
      description:
        "Compare supplied section and positive reference tissue lengths, preserving negative shortening for expansion without diagnostic interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sectionLength: { type: "number", minimum: 0 },
          referenceTissueLength: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["sectionLength", "referenceTissueLength"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lengthRatio: { type: "number" },
          fractionalShortening: { type: "number" },
        },
        required: ["lengthRatio", "fractionalShortening"],
      },
      ports: {
        inputs: [
          {
            id: "sectionLength",
            label: "Section Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTissueLength",
            label: "Reference Tissue Length",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lengthRatio",
            label: "Length Ratio",
            valueType: { type: "number" },
          },
          {
            id: "fractionalShortening",
            label: "Fractional Shortening",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tissueSectionCompressionLengthRatioTool.execute;
export default tissueSectionCompressionLengthRatioTool;
