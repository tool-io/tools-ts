import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly value: number;
  readonly lower: number;
  readonly upper: number;
  readonly reverse: boolean;
};
export type Output = { readonly value: number; readonly reversed: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    value: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
    reverse: { type: "boolean" },
  },
  required: ["value", "lower", "upper", "reverse"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" }, reversed: { type: "boolean" } },
  required: ["value", "reversed"],
} as const;
/** Reflect a supplied bounded research response under an explicit direction flag without claiming a validated scale score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { value, lower, upper, reverse } = request;
  const compute = (): Output => {
    H.domain(lower <= upper && value >= lower && value <= upper);
    return {
      value: reverse ? lower + upper - value : value,
      reversed: reverse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { value: 2, lower: 0, upper: 5, reverse: true },
  output: { value: 3, reversed: true },
} satisfies ToolExample<Input, Output>;
export const scaleDirectionReversalFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/scale-direction-reversal-flag",
    title: "Scale Direction Reversal Flag Tool",
    description:
      "Reflect a supplied bounded research response under an explicit direction flag without claiming a validated scale score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        value: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
        reverse: { type: "boolean" },
      },
      required: ["value", "lower", "upper", "reverse"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" }, reversed: { type: "boolean" } },
      required: ["value", "reversed"],
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
        {
          id: "reverse",
          label: "Reverse",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "number" } },
        { id: "reversed", label: "Reversed", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = scaleDirectionReversalFlagTool.execute;
export default scaleDirectionReversalFlagTool;
