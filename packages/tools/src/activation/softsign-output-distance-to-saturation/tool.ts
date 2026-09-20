import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly x: number };
export type Output = {
  readonly positiveGap: number;
  readonly negativeGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { x: { type: "number" } },
  required: ["x"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveGap: { type: "number" },
    negativeGap: { type: "number" },
  },
  required: ["positiveGap", "negativeGap"],
} as const;
/** Calculate softsign output distance to saturation from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x } = request;
  const compute = (): Output => {
    const y = x / (1 + Math.abs(x));
    return { positiveGap: 1 - y, negativeGap: 1 + y };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 3 },
  output: { positiveGap: 0.25, negativeGap: 1.75 },
} satisfies ToolExample<Input, Output>;
export const softsignOutputDistanceToSaturationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/softsign-output-distance-to-saturation",
    title: "Softsign Output Distance To Saturation Tool",
    description:
      "Calculate softsign output distance to saturation from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { x: { type: "number" } },
      required: ["x"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveGap: { type: "number" },
        negativeGap: { type: "number" },
      },
      required: ["positiveGap", "negativeGap"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
      ],
      outputs: [
        {
          id: "positiveGap",
          label: "Positive Gap",
          valueType: { type: "number" },
        },
        {
          id: "negativeGap",
          label: "Negative Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = softsignOutputDistanceToSaturationTool.execute;
export default softsignOutputDistanceToSaturationTool;
