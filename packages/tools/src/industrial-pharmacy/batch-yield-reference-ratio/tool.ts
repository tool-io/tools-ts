import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualYield: number;
  readonly referenceYield: number;
};
export type Output = { readonly ratio: number; readonly deviation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualYield: { type: "number", minimum: 0 },
    referenceYield: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["actualYield", "referenceYield"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" }, deviation: { type: "number" } },
  required: ["ratio", "deviation"],
} as const;
/** Compare explicit bench production yield quantities without assigning a release criterion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualYield, referenceYield } = request;
  const compute = (): Output => {
    H.domain(actualYield >= 0);
    H.positive(referenceYield);
    return {
      ratio: actualYield / referenceYield,
      deviation: actualYield / referenceYield - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualYield: 80, referenceYield: 100 },
  output: { ratio: 0.8, deviation: -0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const batchYieldReferenceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/batch-yield-reference-ratio",
    title: "Batch Yield Reference Ratio Tool",
    description:
      "Compare explicit bench production yield quantities without assigning a release criterion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualYield: { type: "number", minimum: 0 },
        referenceYield: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["actualYield", "referenceYield"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" }, deviation: { type: "number" } },
      required: ["ratio", "deviation"],
    },
    ports: {
      inputs: [
        {
          id: "actualYield",
          label: "Actual Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceYield",
          label: "Reference Yield",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        { id: "deviation", label: "Deviation", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = batchYieldReferenceRatioTool.execute;
export default batchYieldReferenceRatioTool;
