import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly relaxedLength: number;
  readonly insertionLength: number;
  readonly maxExtensionFraction: number;
};
export type Output = {
  readonly requiredExtension: number;
  readonly margin: number;
  readonly feasible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relaxedLength: { type: "number", exclusiveMinimum: 0 },
    insertionLength: { type: "number", minimum: 0 },
    maxExtensionFraction: { type: "number", minimum: 0 },
  },
  required: ["relaxedLength", "insertionLength", "maxExtensionFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredExtension: { type: "number" },
    margin: { type: "number" },
    feasible: { type: "boolean" },
  },
  required: ["requiredExtension", "margin", "feasible"],
} as const;
/** Calculate elastic insertion stretch limit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { relaxedLength, insertionLength, maxExtensionFraction } = request;
  const compute = (): Output => {
    H.positive(relaxedLength);
    H.domain(insertionLength >= 0 && maxExtensionFraction >= 0);
    return {
      requiredExtension: (insertionLength - relaxedLength) / relaxedLength,
      margin:
        maxExtensionFraction -
        (insertionLength - relaxedLength) / relaxedLength,
      feasible: insertionLength <= relaxedLength * (1 + maxExtensionFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { relaxedLength: 40, insertionLength: 60, maxExtensionFraction: 0.75 },
  output: { requiredExtension: 0.5, margin: 0.25, feasible: true },
} satisfies ToolExample<Input, Output>;
export const elasticInsertionStretchLimitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/elastic-insertion-stretch-limit-gap",
    title: "Elastic Insertion Stretch Limit Gap Tool",
    description:
      "Calculate elastic insertion stretch limit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relaxedLength: { type: "number", exclusiveMinimum: 0 },
        insertionLength: { type: "number", minimum: 0 },
        maxExtensionFraction: { type: "number", minimum: 0 },
      },
      required: ["relaxedLength", "insertionLength", "maxExtensionFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredExtension: { type: "number" },
        margin: { type: "number" },
        feasible: { type: "boolean" },
      },
      required: ["requiredExtension", "margin", "feasible"],
    },
    ports: {
      inputs: [
        {
          id: "relaxedLength",
          label: "Relaxed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insertionLength",
          label: "Insertion Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maxExtensionFraction",
          label: "Max Extension Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredExtension",
          label: "Required Extension",
          valueType: { type: "number" },
        },
        { id: "margin", label: "Margin", valueType: { type: "number" } },
        { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = elasticInsertionStretchLimitGapTool.execute;
export default elasticInsertionStretchLimitGapTool;
