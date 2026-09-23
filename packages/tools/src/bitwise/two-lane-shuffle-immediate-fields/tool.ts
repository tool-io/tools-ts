import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly immediate: number;
  readonly bitsPerLane: number;
};
export type Output = { readonly first: number; readonly second: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    immediate: { type: "integer", minimum: 0 },
    bitsPerLane: { type: "integer", minimum: 1, maximum: 8 },
  },
  required: ["immediate", "bitsPerLane"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { first: { type: "integer" }, second: { type: "integer" } },
  required: ["first", "second"],
} as const;
/** Calculate two lane shuffle immediate fields from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { immediate, bitsPerLane } = input;
  const compute = (): Output => {
    H.integer(bitsPerLane, 1, 8);
    H.integer(immediate, 0, 2 ** (2 * bitsPerLane) - 1);
    const mask = 2 ** bitsPerLane - 1;
    return { first: immediate & mask, second: immediate >> bitsPerLane };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { immediate: 9, bitsPerLane: 2 },
  output: { first: 1, second: 2 },
} satisfies ToolExample<Input, Output>;
export const twoLaneShuffleImmediateFieldsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/two-lane-shuffle-immediate-fields",
    title: "Two Lane Shuffle Immediate Fields Tool",
    description:
      "Calculate two lane shuffle immediate fields from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        immediate: { type: "integer", minimum: 0 },
        bitsPerLane: { type: "integer", minimum: 1, maximum: 8 },
      },
      required: ["immediate", "bitsPerLane"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { first: { type: "integer" }, second: { type: "integer" } },
      required: ["first", "second"],
    },
    ports: {
      inputs: [
        {
          id: "immediate",
          label: "Immediate",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bitsPerLane",
          label: "Bits Per Lane",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "first", label: "First", valueType: { type: "integer" } },
        { id: "second", label: "Second", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = twoLaneShuffleImmediateFieldsTool.execute;
export default twoLaneShuffleImmediateFieldsTool;
