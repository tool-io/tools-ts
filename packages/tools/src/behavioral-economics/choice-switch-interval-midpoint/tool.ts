import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerValue: number;
  readonly upperValue: number;
};
export type Output = { readonly midpoint: number; readonly halfWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerValue: { type: "number" },
    upperValue: { type: "number" },
  },
  required: ["lowerValue", "upperValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, halfWidth: { type: "number" } },
  required: ["midpoint", "halfWidth"],
} as const;
/** Summarize a supplied switching-value interval without inferring an exact preference parameter. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerValue, upperValue } = request;
  const compute = (): Output => {
    H.domain(lowerValue <= upperValue);
    return {
      midpoint: lowerValue + (upperValue - lowerValue) / 2,
      halfWidth: (upperValue - lowerValue) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerValue: 20, upperValue: 40 },
  output: { midpoint: 30, halfWidth: 10 },
} satisfies ToolExample<Input, Output>;
export const choiceSwitchIntervalMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/choice-switch-interval-midpoint",
    title: "Choice Switch Interval Midpoint Tool",
    description:
      "Summarize a supplied switching-value interval without inferring an exact preference parameter.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerValue: { type: "number" },
        upperValue: { type: "number" },
      },
      required: ["lowerValue", "upperValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        halfWidth: { type: "number" },
      },
      required: ["midpoint", "halfWidth"],
    },
    ports: {
      inputs: [
        {
          id: "lowerValue",
          label: "Lower Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperValue",
          label: "Upper Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        { id: "halfWidth", label: "Half Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = choiceSwitchIntervalMidpointTool.execute;
export default choiceSwitchIntervalMidpointTool;
