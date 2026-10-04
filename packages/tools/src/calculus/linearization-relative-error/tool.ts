import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actualValue: number;
  readonly linearizedValue: number;
};
export type Output = { readonly absoluteRelativeError: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actualValue: { type: "number" },
    linearizedValue: { type: "number" },
  },
  required: ["actualValue", "linearizedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { absoluteRelativeError: { type: "number" } },
  required: ["absoluteRelativeError"],
} as const;
/** Compare a supplied local linear approximation with the actual nonzero function value using absolute relative error. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actualValue, linearizedValue } = request;
  const compute = (): Output => {
    H.domain(actualValue !== 0, "actualValue");
    return {
      absoluteRelativeError: Math.abs(
        (linearizedValue - actualValue) / actualValue,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { actualValue: 8, linearizedValue: 10 },
  output: { absoluteRelativeError: 0.25 },
} satisfies ToolExample<Input, Output>;
export const linearizationRelativeErrorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "calculus/linearization-relative-error",
    title: "Linearization Relative Error Tool",
    description:
      "Compare a supplied local linear approximation with the actual nonzero function value using absolute relative error.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actualValue: { type: "number" },
        linearizedValue: { type: "number" },
      },
      required: ["actualValue", "linearizedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { absoluteRelativeError: { type: "number" } },
      required: ["absoluteRelativeError"],
    },
    ports: {
      inputs: [
        {
          id: "actualValue",
          label: "Actual Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "linearizedValue",
          label: "Linearized Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteRelativeError",
          label: "Absolute Relative Error",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = linearizationRelativeErrorTool.execute;
export default linearizationRelativeErrorTool;
