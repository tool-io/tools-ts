import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstObservation: number;
  readonly secondObservation: number;
  readonly secondMinusFirst: boolean;
};
export type Output = { readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstObservation: { type: "number" },
    secondObservation: { type: "number" },
    secondMinusFirst: { type: "boolean" },
  },
  required: ["firstObservation", "secondObservation", "secondMinusFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" } },
  required: ["difference"],
} as const;
/** Return an explicitly oriented paired difference without estimating a sample mean or testing a hypothesis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstObservation, secondObservation, secondMinusFirst } = request;
  const compute = (): Output => {
    return {
      difference:
        (secondObservation - firstObservation) * (secondMinusFirst ? 1 : -1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstObservation: 3, secondObservation: 8, secondMinusFirst: true },
  output: { difference: 5 },
} satisfies ToolExample<Input, Output>;
export const pairedDifferenceReferenceSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["statistics", "mathematics"],
      keywords: ["statistics", "mathematics"],
    },
    id: "statistics/paired-difference-reference-sign",
    title: "Paired Difference Reference Sign",
    description:
      "Return an explicitly oriented paired difference without estimating a sample mean or testing a hypothesis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstObservation: { type: "number" },
        secondObservation: { type: "number" },
        secondMinusFirst: { type: "boolean" },
      },
      required: ["firstObservation", "secondObservation", "secondMinusFirst"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" } },
      required: ["difference"],
    },
    ports: {
      inputs: [
        {
          id: "firstObservation",
          label: "First Observation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondObservation",
          label: "Second Observation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMinusFirst",
          label: "Second Minus First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pairedDifferenceReferenceSignTool.execute;
export default pairedDifferenceReferenceSignTool;
