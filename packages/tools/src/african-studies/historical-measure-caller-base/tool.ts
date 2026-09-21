import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly baseUnitsPerMeasure: number;
  readonly source: string;
};
export type Output = { readonly baseQuantity: number; readonly source: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number" },
    baseUnitsPerMeasure: { type: "number", exclusiveMinimum: 0 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["quantity", "baseUnitsPerMeasure", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseQuantity: { type: "number" },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["baseQuantity", "source"],
} as const;
/** Convert a supplied historical measure with an explicit source-specific factor. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, baseUnitsPerMeasure, source } = request;
  const compute = (): Output => {
    H.positive(baseUnitsPerMeasure);
    H.domain(source.length > 0);
    return { baseQuantity: quantity * baseUnitsPerMeasure, source };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 3, baseUnitsPerMeasure: 20, source: "archive-v1" },
  output: { baseQuantity: 60, source: "archive-v1" },
} satisfies ToolExample<Input, Output>;
export const historicalMeasureCallerBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/historical-measure-caller-base",
    title: "Historical Measure Caller Base Tool",
    description:
      "Convert a supplied historical measure with an explicit source-specific factor.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number" },
        baseUnitsPerMeasure: { type: "number", exclusiveMinimum: 0 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["quantity", "baseUnitsPerMeasure", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseQuantity: { type: "number" },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["baseQuantity", "source"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseUnitsPerMeasure",
          label: "Base Units Per Measure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "baseQuantity",
          label: "Base Quantity",
          valueType: { type: "number" },
        },
        { id: "source", label: "Source", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = historicalMeasureCallerBaseTool.execute;
export default historicalMeasureCallerBaseTool;
