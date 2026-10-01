import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
};
export type Output = {
  readonly clipped: number;
  readonly signedDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["value", "lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clipped: { type: "number" },
    signedDistance: { type: "number" },
  },
  required: ["clipped", "signedDistance"],
} as const;
/** Calculate clipped value distance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, upper } = request;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return {
      clipped: Math.max(lower, Math.min(upper, value)),
      signedDistance: value - Math.max(lower, Math.min(upper, value)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 7, lower: 0, upper: 5 },
  output: { clipped: 5, signedDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const clippedValueDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/clipped-value-distance",
    title: "Clipped Value Distance Tool",
    description:
      "Calculate clipped value distance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["value", "lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clipped: { type: "number" },
        signedDistance: { type: "number" },
      },
      required: ["clipped", "signedDistance"],
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
        { id: "clipped", label: "Clipped", valueType: { type: "number" } },
        {
          id: "signedDistance",
          label: "Signed Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = clippedValueDistanceTool.execute;
export default clippedValueDistanceTool;
