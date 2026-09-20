import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly output: number };
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly lowerUnbounded: boolean;
  readonly upperUnbounded: boolean;
  readonly singleton: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { output: { type: "number", minimum: 0, maximum: 6 } },
  required: ["output"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    lowerUnbounded: { type: "boolean" },
    upperUnbounded: { type: "boolean" },
    singleton: { type: "boolean" },
  },
  required: ["lower", "upper", "lowerUnbounded", "upperUnbounded", "singleton"],
} as const;
/** Represent the complete ReLU6 preimage with explicit unbounded flags and finite placeholder endpoints. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { output } = input;
  const compute = (): Output => {
    H.domain(output >= 0 && output <= 6);
    return {
      lower: output,
      upper: output,
      lowerUnbounded: output === 0,
      upperUnbounded: output === 6,
      singleton: output > 0 && output < 6,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { output: 0 },
  output: {
    lower: 0,
    upper: 0,
    lowerUnbounded: true,
    upperUnbounded: false,
    singleton: false,
  },
} satisfies ToolExample<Input, Output>;
export const relu6OutputPreimageIntervalTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/relu6-output-preimage-interval",
    title: "ReLU6 Output Preimage Interval Tool",
    description:
      "Represent the complete ReLU6 preimage with explicit unbounded flags and finite placeholder endpoints.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { output: { type: "number", minimum: 0, maximum: 6 } },
      required: ["output"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        lowerUnbounded: { type: "boolean" },
        upperUnbounded: { type: "boolean" },
        singleton: { type: "boolean" },
      },
      required: [
        "lower",
        "upper",
        "lowerUnbounded",
        "upperUnbounded",
        "singleton",
      ],
    },
    ports: {
      inputs: [
        {
          id: "output",
          label: "Output",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "lowerUnbounded",
          label: "Lower Unbounded",
          valueType: { type: "boolean" },
        },
        {
          id: "upperUnbounded",
          label: "Upper Unbounded",
          valueType: { type: "boolean" },
        },
        { id: "singleton", label: "Singleton", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = relu6OutputPreimageIntervalTool.execute;
export default relu6OutputPreimageIntervalTool;
