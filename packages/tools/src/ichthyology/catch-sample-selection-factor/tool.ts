import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleCount: number;
  readonly catchCount: number;
};
export type Output = {
  readonly selectionFraction: number;
  readonly expansionFactor: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleCount: { type: "integer", minimum: 0 },
    catchCount: { type: "integer", minimum: 1 },
  },
  required: ["sampleCount", "catchCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectionFraction: { type: "number" },
    expansionFactor: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["selectionFraction", "expansionFactor", "defined"],
} as const;
/** Report explicit sampled-catch fractions without assuming random or representative sampling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleCount, catchCount } = request;
  const compute = (): Output => {
    H.integer(catchCount, 1);
    H.integer(sampleCount, 0, catchCount);
    return {
      selectionFraction: sampleCount / catchCount,
      expansionFactor: sampleCount > 0 ? catchCount / sampleCount : 0,
      defined: sampleCount > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleCount: 10, catchCount: 100 },
  output: { selectionFraction: 0.1, expansionFactor: 10, defined: true },
} satisfies ToolExample<Input, Output>;
export const catchSampleSelectionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/catch-sample-selection-factor",
    title: "Catch Sample Selection Factor Tool",
    description:
      "Report explicit sampled-catch fractions without assuming random or representative sampling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleCount: { type: "integer", minimum: 0 },
        catchCount: { type: "integer", minimum: 1 },
      },
      required: ["sampleCount", "catchCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selectionFraction: { type: "number" },
        expansionFactor: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["selectionFraction", "expansionFactor", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "sampleCount",
          label: "Sample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "catchCount",
          label: "Catch Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "selectionFraction",
          label: "Selection Fraction",
          valueType: { type: "number" },
        },
        {
          id: "expansionFactor",
          label: "Expansion Factor",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = catchSampleSelectionFactorTool.execute;
export default catchSampleSelectionFactorTool;
