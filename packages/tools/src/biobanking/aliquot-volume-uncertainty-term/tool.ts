import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dispenses: number;
  readonly perDispenseStandardUncertainty: number;
  readonly correlation: number;
};
export type Output = { readonly standardUncertainty: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dispenses: { type: "integer", minimum: 1 },
    perDispenseStandardUncertainty: { type: "number", minimum: 0 },
    correlation: { type: "number", maximum: 1 },
  },
  required: ["dispenses", "perDispenseStandardUncertainty", "correlation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { standardUncertainty: { type: "number" } },
  required: ["standardUncertainty"],
} as const;
/** Combine equal dispense standard uncertainties under a supplied common correlation; for one dispense correlation has no effect. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dispenses, perDispenseStandardUncertainty, correlation } = request;
  const compute = (): Output => {
    H.integer(dispenses, 1);
    H.domain(
      perDispenseStandardUncertainty >= 0 &&
        correlation <= 1 &&
        correlation >= -1 / (dispenses === 1 ? 1 : dispenses - 1),
    );
    return {
      standardUncertainty:
        perDispenseStandardUncertainty *
        Math.sqrt(dispenses * (1 + (dispenses - 1) * correlation)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dispenses: 4, perDispenseStandardUncertainty: 0.1, correlation: 0 },
  output: { standardUncertainty: 0.2 },
} satisfies ToolExample<Input, Output>;
export const aliquotVolumeUncertaintyTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/aliquot-volume-uncertainty-term",
    title: "Aliquot Volume Uncertainty Term Tool",
    description:
      "Combine equal dispense standard uncertainties under a supplied common correlation; for one dispense correlation has no effect.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dispenses: { type: "integer", minimum: 1 },
        perDispenseStandardUncertainty: { type: "number", minimum: 0 },
        correlation: { type: "number", maximum: 1 },
      },
      required: ["dispenses", "perDispenseStandardUncertainty", "correlation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { standardUncertainty: { type: "number" } },
      required: ["standardUncertainty"],
    },
    ports: {
      inputs: [
        {
          id: "dispenses",
          label: "Dispenses",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "perDispenseStandardUncertainty",
          label: "Per Dispense Standard Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correlation",
          label: "Correlation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "standardUncertainty",
          label: "Standard Uncertainty",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aliquotVolumeUncertaintyTermTool.execute;
export default aliquotVolumeUncertaintyTermTool;
