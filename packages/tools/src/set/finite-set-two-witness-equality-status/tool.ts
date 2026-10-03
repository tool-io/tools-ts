import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: readonly string[];
  readonly right: readonly string[];
};
export type Output = {
  readonly equal: boolean;
  readonly leftWitness: readonly string[];
  readonly rightWitness: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    right: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equal: { type: "boolean" },
    leftWitness: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    rightWitness: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["equal", "leftWitness", "rightWitness"],
} as const;
/** Compute finite set two witness equality status from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right } = input;
  const compute = (): Output => {
    const a = new Set(left),
      b = new Set(right),
      leftWitness = [...a].filter((x) => !b.has(x)).slice(0, 1),
      rightWitness = [...b].filter((x) => !a.has(x)).slice(0, 1);
    return {
      equal: !leftWitness.length && !rightWitness.length,
      leftWitness,
      rightWitness,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: ["a", "b"], right: ["b", "c"] },
  output: { equal: false, leftWitness: ["a"], rightWitness: ["c"] },
} satisfies ToolExample<Input, Output>;
export const finiteSetTwoWitnessEqualityStatusTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/finite-set-two-witness-equality-status",
  title: "Finite Set Two Witness Equality Status Tool",
  description:
    "Compute finite set two witness equality status from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      { id: "equal", label: "Equal", valueType: { type: "boolean" } },
      {
        id: "leftWitness",
        label: "Left Witness",
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "rightWitness",
        label: "Right Witness",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = finiteSetTwoWitnessEqualityStatusTool.execute;
export default finiteSetTwoWitnessEqualityStatusTool;
