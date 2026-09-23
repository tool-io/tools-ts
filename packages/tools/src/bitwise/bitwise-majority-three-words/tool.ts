import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly second: number;
  readonly third: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer" },
    second: { type: "integer" },
    third: { type: "integer" },
  },
  required: ["first", "second", "third"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "integer" } },
  required: ["value"],
} as const;
/** Calculate bitwise majority three words from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, second, third } = input;
  const compute = (): Output => {
    for (const x of [first, second, third]) H.integer(x, 0, 4294967295);
    return {
      value: ((first & second) | (first & third) | (second & third)) >>> 0,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 170, second: 85, third: 15 },
  output: { value: 15 },
} satisfies ToolExample<Input, Output>;
export const bitwiseMajorityThreeWordsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/bitwise-majority-three-words",
    title: "Bitwise Majority Three Words Tool",
    description:
      "Calculate bitwise majority three words from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer" },
        second: { type: "integer" },
        third: { type: "integer" },
      },
      required: ["first", "second", "third"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "integer" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "third",
          label: "Third",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "value", label: "Value", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = bitwiseMajorityThreeWordsTool.execute;
export default bitwiseMajorityThreeWordsTool;
