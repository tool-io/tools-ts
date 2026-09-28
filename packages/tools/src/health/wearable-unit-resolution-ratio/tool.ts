import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstResolution: number;
  readonly firstBasePerUnit: number;
  readonly secondResolution: number;
  readonly secondBasePerUnit: number;
};
export type Output = {
  readonly firstBaseResolution: number;
  readonly secondBaseResolution: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstResolution: { type: "number", exclusiveMinimum: 0 },
    firstBasePerUnit: { type: "number", exclusiveMinimum: 0 },
    secondResolution: { type: "number", exclusiveMinimum: 0 },
    secondBasePerUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "firstResolution",
    "firstBasePerUnit",
    "secondResolution",
    "secondBasePerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBaseResolution: { type: "number" },
    secondBaseResolution: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["firstBaseResolution", "secondBaseResolution", "ratio"],
} as const;
/** Compare two supplied device quantization resolutions in a caller-selected common unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstResolution,
    firstBasePerUnit,
    secondResolution,
    secondBasePerUnit,
  } = request;
  const compute = (): Output => {
    H.positive(firstResolution);
    H.positive(firstBasePerUnit);
    H.positive(secondResolution);
    H.positive(secondBasePerUnit);
    return {
      firstBaseResolution: firstResolution * firstBasePerUnit,
      secondBaseResolution: secondResolution * secondBasePerUnit,
      ratio:
        (firstResolution * firstBasePerUnit) /
        (secondResolution * secondBasePerUnit),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstResolution: 1,
    firstBasePerUnit: 0.001,
    secondResolution: 0.01,
    secondBasePerUnit: 1,
  },
  output: {
    firstBaseResolution: 0.001,
    secondBaseResolution: 0.01,
    ratio: 0.1,
  },
} satisfies ToolExample<Input, Output>;
export const wearableUnitResolutionRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/wearable-unit-resolution-ratio",
    title: "Wearable Unit Resolution Ratio Tool",
    description:
      "Compare two supplied device quantization resolutions in a caller-selected common unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstResolution: { type: "number", exclusiveMinimum: 0 },
        firstBasePerUnit: { type: "number", exclusiveMinimum: 0 },
        secondResolution: { type: "number", exclusiveMinimum: 0 },
        secondBasePerUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "firstResolution",
        "firstBasePerUnit",
        "secondResolution",
        "secondBasePerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBaseResolution: { type: "number" },
        secondBaseResolution: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["firstBaseResolution", "secondBaseResolution", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "firstResolution",
          label: "First Resolution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstBasePerUnit",
          label: "First Base Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondResolution",
          label: "Second Resolution",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondBasePerUnit",
          label: "Second Base Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstBaseResolution",
          label: "First Base Resolution",
          valueType: { type: "number" },
        },
        {
          id: "secondBaseResolution",
          label: "Second Base Resolution",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wearableUnitResolutionRatioTool.execute;
export default wearableUnitResolutionRatioTool;
