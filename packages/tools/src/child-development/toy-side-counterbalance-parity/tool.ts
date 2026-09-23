import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trialIndex: number;
  readonly initialRight: boolean;
  readonly reversed: boolean;
};
export type Output = { readonly rightSide: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trialIndex: { type: "integer", minimum: 0 },
    initialRight: { type: "boolean" },
    reversed: { type: "boolean" },
  },
  required: ["trialIndex", "initialRight", "reversed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rightSide: { type: "boolean" } },
  required: ["rightSide"],
} as const;
/** Deterministic alternating-side research assignment from explicit zero-based trial index and reversal flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trialIndex, initialRight, reversed } = request;
  const compute = (): Output => {
    H.integer(trialIndex, 0);
    return {
      rightSide: ((trialIndex % 2 === 0) === initialRight) !== reversed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trialIndex: 0, initialRight: true, reversed: false },
  output: { rightSide: true },
} satisfies ToolExample<Input, Output>;
export const toySideCounterbalanceParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/toy-side-counterbalance-parity",
    title: "Toy Side Counterbalance Parity Tool",
    description:
      "Deterministic alternating-side research assignment from explicit zero-based trial index and reversal flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trialIndex: { type: "integer", minimum: 0 },
        initialRight: { type: "boolean" },
        reversed: { type: "boolean" },
      },
      required: ["trialIndex", "initialRight", "reversed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rightSide: { type: "boolean" } },
      required: ["rightSide"],
    },
    ports: {
      inputs: [
        {
          id: "trialIndex",
          label: "Trial Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "initialRight",
          label: "Initial Right",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reversed",
          label: "Reversed",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "rightSide",
          label: "Right Side",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = toySideCounterbalanceParityTool.execute;
export default toySideCounterbalanceParityTool;
