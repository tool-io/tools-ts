import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  parseJson,
  list,
  text,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: string;
  readonly right: string;
  readonly blocksJson: string;
};
export type Output = {
  readonly sameBlock: boolean;
  readonly leftBlock: number;
  readonly rightBlock: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
    blocksJson: { type: "string", maxLength: 8192 },
  },
  required: ["left", "right", "blocksJson"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sameBlock: { type: "boolean" },
    leftBlock: { type: "integer" },
    rightBlock: { type: "integer" },
  },
  required: ["sameBlock", "leftBlock", "rightBlock"],
} as const;
/** Compute set partition single pair coassignment from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, blocksJson } = input;
  const compute = (): Output => {
    const blocks = list(parseJson(blocksJson)).map((x) => list(x).map(text));
    const flat = blocks.flat();
    domain(new Set(flat).size === flat.length);
    const leftBlock = blocks.findIndex((x) => x.includes(left)),
      rightBlock = blocks.findIndex((x) => x.includes(right));
    domain(leftBlock >= 0 && rightBlock >= 0);
    return { sameBlock: leftBlock === rightBlock, leftBlock, rightBlock };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "a", right: "b", blocksJson: '[["a","b"],["c"]]' },
  output: { sameBlock: true, leftBlock: 0, rightBlock: 0 },
} satisfies ToolExample<Input, Output>;
export const setPartitionSinglePairCoassignmentTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/set-partition-single-pair-coassignment",
  title: "Set Partition Single Pair Coassignment Tool",
  description:
    "Compute set partition single pair coassignment from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "blocksJson",
        label: "Blocks Json",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "sameBlock", label: "Same Block", valueType: { type: "boolean" } },
      { id: "leftBlock", label: "Left Block", valueType: { type: "integer" } },
      {
        id: "rightBlock",
        label: "Right Block",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = setPartitionSinglePairCoassignmentTool.execute;
export default setPartitionSinglePairCoassignmentTool;
