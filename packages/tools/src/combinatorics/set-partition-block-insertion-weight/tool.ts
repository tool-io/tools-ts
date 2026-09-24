import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly blocks: number };
export type Output = {
  readonly existingBlockChoices: number;
  readonly newBlockChoices: number;
  readonly totalChoices: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { blocks: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["blocks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    existingBlockChoices: { type: "integer" },
    newBlockChoices: { type: "integer" },
    totalChoices: { type: "integer" },
  },
  required: ["existingBlockChoices", "newBlockChoices", "totalChoices"],
} as const;
/** Compute set partition block insertion weight from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { blocks } = input;
  const compute = (): Output => {
    integer(blocks, 0, 255);
    return {
      existingBlockChoices: blocks,
      newBlockChoices: 1,
      totalChoices: blocks + 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { blocks: 3 },
  output: { existingBlockChoices: 3, newBlockChoices: 1, totalChoices: 4 },
} satisfies ToolExample<Input, Output>;
export const setPartitionBlockInsertionWeightTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "combinatorics/set-partition-block-insertion-weight",
  title: "Set Partition Block Insertion Weight Tool",
  description:
    "Compute set partition block insertion weight from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "blocks",
        label: "Blocks",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      {
        id: "existingBlockChoices",
        label: "Existing Block Choices",
        valueType: { type: "integer" },
      },
      {
        id: "newBlockChoices",
        label: "New Block Choices",
        valueType: { type: "integer" },
      },
      {
        id: "totalChoices",
        label: "Total Choices",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = setPartitionBlockInsertionWeightTool.execute;
export default setPartitionBlockInsertionWeightTool;
