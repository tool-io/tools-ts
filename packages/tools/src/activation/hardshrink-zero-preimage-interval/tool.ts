import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly threshold: number };
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly includeLower: boolean;
  readonly includeUpper: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { threshold: { type: "number", minimum: 0 } },
  required: ["threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    includeLower: { type: "boolean" },
    includeUpper: { type: "boolean" },
  },
  required: ["lower", "upper", "includeLower", "includeUpper"],
} as const;
/** Return the closed interval mapped to zero by the strict-outside-threshold hard-shrink convention. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { threshold } = input;
  const compute = (): Output => {
    H.domain(threshold >= 0);
    return {
      lower: -threshold,
      upper: threshold,
      includeLower: true,
      includeUpper: true,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { threshold: 0.5 },
  output: { lower: -0.5, upper: 0.5, includeLower: true, includeUpper: true },
} satisfies ToolExample<Input, Output>;
export const hardshrinkZeroPreimageIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/hardshrink-zero-preimage-interval",
    title: "Hardshrink Zero Preimage Interval Tool",
    description:
      "Return the closed interval mapped to zero by the strict-outside-threshold hard-shrink convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { threshold: { type: "number", minimum: 0 } },
      required: ["threshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        includeLower: { type: "boolean" },
        includeUpper: { type: "boolean" },
      },
      required: ["lower", "upper", "includeLower", "includeUpper"],
    },
    ports: {
      inputs: [
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "includeLower",
          label: "Include Lower",
          valueType: { type: "boolean" },
        },
        {
          id: "includeUpper",
          label: "Include Upper",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = hardshrinkZeroPreimageIntervalTool.execute;
export default hardshrinkZeroPreimageIntervalTool;
