import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: string;
  readonly right: string;
  readonly members: readonly string[];
};
export type Output = {
  readonly between: readonly string[];
  readonly count: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "string", maxLength: 8192 },
    right: { type: "string", maxLength: 8192 },
    members: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["left", "right", "members"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    between: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    count: { type: "integer" },
  },
  required: ["between", "count"],
} as const;
/** Compute ordered set exclusive rank gap from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, members } = input;
  const compute = (): Output => {
    domain(
      left < right && members.every((x, i) => i === 0 || x > members[i - 1]),
    );
    const between = members.filter((x) => x > left && x < right);
    return { between, count: between.length };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: "a", right: "d", members: ["a", "b", "c", "d"] },
  output: { between: ["b", "c"], count: 2 },
} satisfies ToolExample<Input, Output>;
export const orderedSetExclusiveRankGapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/ordered-set-exclusive-rank-gap",
  title: "Ordered Set Exclusive Rank Gap Tool",
  description:
    "Compute ordered set exclusive rank gap from explicit bounded inputs.",
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
        id: "members",
        label: "Members",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      {
        id: "between",
        label: "Between",
        valueType: { type: "list", items: { type: "string" } },
      },
      { id: "count", label: "Count", valueType: { type: "integer" } },
    ],
  },
});
export const run = orderedSetExclusiveRankGapTool.execute;
export default orderedSetExclusiveRankGapTool;
