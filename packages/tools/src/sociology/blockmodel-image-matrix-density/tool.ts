import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  aligned,
  graph,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedDirectedAdjacency: readonly (readonly number[])[];
  readonly callerBlockAssignments: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedDirectedAdjacency",
    label: "Observed directed adjacency",
    kind: "matrix",
  },
  {
    id: "callerBlockAssignments",
    label: "Caller block assignments",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const n = graph(input.observedDirectedAdjacency, true);
  aligned(
    input.observedDirectedAdjacency,
    input.callerBlockAssignments,
    "blocks",
  );
  if (input.callerBlockAssignments.some((v) => !v.trim()))
    simpleError("blocks", "Nonempty caller-defined blocks.");
  const ids = [...new Set(input.callerBlockAssignments)];
  return {
    blockIds: ids,
    observedBlockDensityMatrix: ids.map((a) =>
      ids.map((b) => {
        let edges = 0,
          possible = 0;
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++)
            if (
              i !== j &&
              input.callerBlockAssignments[i] === a &&
              input.callerBlockAssignments[j] === b
            ) {
              possible++;
              edges += input.observedDirectedAdjacency[i][j];
            }
        return possible ? edges / possible : 0;
      }),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedDirectedAdjacency: [
      [0, 1, 0],
      [0, 0, 1],
      [1, 0, 0],
    ],
    callerBlockAssignments: ["a", "a", "b"],
  },
  output: {
    result: {
      blockIds: ["a", "b"],
      observedBlockDensityMatrix: [
        [0.5, 0.5],
        [0.5, 0],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/blockmodel-image-matrix-density",
  title: "Blockmodel Image Matrix Density Calculator",
  description:
    "Actual directed blockmodel density under independent block assignments, self-loops excluded. No eligible dyad returns0by explicit empty-cell convention, not inferred equivalence or latent community detection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
