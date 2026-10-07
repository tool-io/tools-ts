import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleSignal: number;
  readonly reagentBlank: number;
  readonly matrixBlank: number;
};
export type Output = { readonly correctedSignal: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSignal: { type: "number" },
    reagentBlank: { type: "number" },
    matrixBlank: { type: "number" },
  },
  required: ["sampleSignal", "reagentBlank", "matrixBlank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedSignal: { type: "number" } },
  required: ["correctedSignal"],
} as const;
/** Subtract two explicitly disjoint additive blank contributions from supplied assay signal without clipping negative residuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleSignal, reagentBlank, matrixBlank } = request;
  const compute = (): Output => {
    return { correctedSignal: sampleSignal - reagentBlank - matrixBlank };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleSignal: 100, reagentBlank: 8, matrixBlank: 12 },
  output: { correctedSignal: 80 },
} satisfies ToolExample<Input, Output>;
export const assayDualBlankResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biochemistry", "biology"],
      keywords: ["biochemistry", "biology"],
    },
    id: "biochemistry/assay-dual-blank-residual",
    title: "Assay Dual Blank Residual",
    description:
      "Subtract two explicitly disjoint additive blank contributions from supplied assay signal without clipping negative residuals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSignal: { type: "number" },
        reagentBlank: { type: "number" },
        matrixBlank: { type: "number" },
      },
      required: ["sampleSignal", "reagentBlank", "matrixBlank"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedSignal: { type: "number" } },
      required: ["correctedSignal"],
    },
    ports: {
      inputs: [
        {
          id: "sampleSignal",
          label: "Sample Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reagentBlank",
          label: "Reagent Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "matrixBlank",
          label: "Matrix Blank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedSignal",
          label: "Corrected Signal",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = assayDualBlankResidualTool.execute;
export default assayDualBlankResidualTool;
