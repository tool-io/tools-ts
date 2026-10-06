import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceLength: number;
  readonly observedLength: number;
};
export type Output = {
  readonly relativeChange: number;
  readonly changePercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceLength: { type: "number", exclusiveMinimum: 0 },
    observedLength: { type: "number", minimum: 0 },
  },
  required: ["referenceLength", "observedLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    relativeChange: { type: "number" },
    changePercent: { type: "number" },
  },
  required: ["relativeChange", "changePercent"],
} as const;
/** Describe signed dimensional change against an explicitly measured canvas reference length without attributing material strain causes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceLength, observedLength } = request;
  const compute = (): Output => {
    (H.domain(referenceLength > 0, "referenceLength"), referenceLength);
    H.domain(observedLength >= 0, "observedLength");
    return {
      relativeChange: (observedLength - referenceLength) / referenceLength,
      changePercent:
        (100 * (observedLength - referenceLength)) / referenceLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceLength: 100, observedLength: 101 },
  output: { relativeChange: 0.01, changePercent: 1 },
} satisfies ToolExample<Input, Output>;
export const canvasRelativeStretchMeasurementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-conservation", "art conservation", "arts and design"],
      keywords: ["art conservation", "arts and design"],
    },
    id: "art-conservation/canvas-relative-stretch-measurement",
    title: "Canvas Relative Stretch Measurement",
    description:
      "Describe signed dimensional change against an explicitly measured canvas reference length without attributing material strain causes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceLength: { type: "number", exclusiveMinimum: 0 },
        observedLength: { type: "number", minimum: 0 },
      },
      required: ["referenceLength", "observedLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        relativeChange: { type: "number" },
        changePercent: { type: "number" },
      },
      required: ["relativeChange", "changePercent"],
    },
    ports: {
      inputs: [
        {
          id: "referenceLength",
          label: "Reference Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedLength",
          label: "Observed Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "relativeChange",
          label: "Relative Change",
          valueType: { type: "number" },
        },
        {
          id: "changePercent",
          label: "Change Percent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = canvasRelativeStretchMeasurementTool.execute;
export default canvasRelativeStretchMeasurementTool;
