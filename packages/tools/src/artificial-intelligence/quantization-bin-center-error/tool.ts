import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly center: number;
  readonly binWidth: number;
};
export type Output = {
  readonly error: number;
  readonly relativeToWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    center: { type: "number" },
    binWidth: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["value", "center", "binWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    error: { type: "number" },
    relativeToWidth: { type: "number" },
  },
  required: ["error", "relativeToWidth"],
} as const;
/** Measure a supplied value relative to an explicit bin center without selecting a quantizer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, center, binWidth } = request;
  const compute = (): Output => {
    H.positive(binWidth);
    return {
      error: value - center,
      relativeToWidth: (value - center) / binWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 1.2, center: 1, binWidth: 0.5 },
  output: { error: 0.19999999999999996, relativeToWidth: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const quantizationBinCenterErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/quantization-bin-center-error",
    title: "Quantization Bin Center Error Tool",
    description:
      "Measure a supplied value relative to an explicit bin center without selecting a quantizer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        center: { type: "number" },
        binWidth: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["value", "center", "binWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        error: { type: "number" },
        relativeToWidth: { type: "number" },
      },
      required: ["error", "relativeToWidth"],
    },
    ports: {
      inputs: [
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "center",
          label: "Center",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "binWidth",
          label: "Bin Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "error", label: "Error", valueType: { type: "number" } },
        {
          id: "relativeToWidth",
          label: "Relative To Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quantizationBinCenterErrorTool.execute;
export default quantizationBinCenterErrorTool;
