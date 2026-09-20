import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly distance: number;
  readonly saturated: boolean;
  readonly nearest: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["x", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number" },
    saturated: { type: "boolean" },
    nearest: { type: "number" },
  },
  required: ["distance", "saturated", "nearest"],
} as const;
/** Measure input displacement from the closed linear interval of a hard-tanh activation. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { x, lower, upper } = input;
  const compute = (): Output => {
    H.domain(lower < upper);
    const nearest = Math.max(lower, Math.min(upper, x));
    return {
      distance: Math.abs(x - nearest),
      saturated: x <= lower || x >= upper,
      nearest,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { x: 3, lower: -1, upper: 1 },
  output: { distance: 2, saturated: true, nearest: 1 },
} satisfies ToolExample<Input, Output>;
export const hardtanhSaturationDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/hardtanh-saturation-distance",
    title: "HardTanh Saturation Distance Tool",
    description:
      "Measure input displacement from the closed linear interval of a hard-tanh activation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["x", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        saturated: { type: "boolean" },
        nearest: { type: "number" },
      },
      required: ["distance", "saturated", "nearest"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        { id: "saturated", label: "Saturated", valueType: { type: "boolean" } },
        { id: "nearest", label: "Nearest", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hardtanhSaturationDistanceTool.execute;
export default hardtanhSaturationDistanceTool;
