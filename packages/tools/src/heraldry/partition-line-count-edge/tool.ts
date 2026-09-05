import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  strictlyIncreasing,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedPartitionEdgePositions: readonly number[];
  readonly edgeLength: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedPartitionEdgePositions",
    label: "Observed partition edge positions",
    kind: "numberList",
  },
  { id: "edgeLength", label: "Edge length", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.edgeLength, "edgeLength");
  input.observedPartitionEdgePositions.forEach((v) =>
    nonnegative(v, "observedPartitionEdgePositions"),
  );
  strictlyIncreasing(input.observedPartitionEdgePositions, "positions", 1);
  if (input.observedPartitionEdgePositions.at(-1)! > input.edgeLength)
    simpleError("positions", "Within measured edge.");
  return {
    intersectionCount: input.observedPartitionEdgePositions.length,
    uncoveredEndGap:
      input.edgeLength -
      input.observedPartitionEdgePositions[
        input.observedPartitionEdgePositions.length - 1
      ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { observedPartitionEdgePositions: [0, 20, 40, 80], edgeLength: 100 },
  output: { result: { intersectionCount: 4, uncoveredEndGap: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/partition-line-count-edge",
  title: "Partition Line Count per Shield Edge Calculator",
  description:
    "Count actual ordered partition intersections on a specified shield edge and retain remaining gap.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
