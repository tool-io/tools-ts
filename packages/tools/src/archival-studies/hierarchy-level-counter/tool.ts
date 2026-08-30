import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, maximum } from "../shared.js";
export type Input = Readonly<{ readonly parentNodeIndices: readonly number[] }>;
export type Output = Readonly<{
  readonly nodeDepthsRootAtZero: readonly number[];
  readonly maximumHierarchyDepth: number;
  readonly rootNodeCount: number;
}>;
const inputFields = [
  { id: "parentNodeIndices", label: "Parent node indices", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const parents = input.parentNodeIndices,
    n = parents.length;
  if (
    !n ||
    n > 1000 ||
    parents.some((v) => !Number.isSafeInteger(v) || v < -1 || v >= n)
  )
    simpleError(
      "parents",
      "At most 1000 nodes with valid parent index or -1 root required.",
    );
  const depths = parents.map((_, i) => {
    const seen = new Set<number>();
    let at = i,
      depth = 0;
    while (parents[at] !== -1) {
      if (seen.has(at))
        simpleError("parents", "Cyclic parent hierarchy rejected.");
      seen.add(at);
      at = parents[at];
      depth++;
    }
    return depth;
  });
  return {
    nodeDepthsRootAtZero: depths,
    maximumHierarchyDepth: maximum(depths),
    rootNodeCount: parents.filter((v) => v === -1).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  parentNodeIndices: [-1, 0, 1, 0],
} satisfies Input;
export const exampleOutput = {
  nodeDepthsRootAtZero: [0, 1, 2, 1],
  maximumHierarchyDepth: 2,
  rootNodeCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/hierarchy-level-counter",
  title: "Arrangement Series Depth Hierarchy Level Counter",
  description:
    "Resolve caller actual parent-index forest depth with explicit roots and cycle refusal, no inference of archival arrangement from a flat count; bounded to one million parent traversals.",
  inputs: inputFields,
  outputs: [
    {
      id: "nodeDepthsRootAtZero",
      label: "Node depths root at zero",
      kind: "numberList",
    },
    {
      id: "maximumHierarchyDepth",
      label: "Maximum hierarchy depth",
      kind: "number",
    },
    { id: "rootNodeCount", label: "Root node count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      parentNodeIndices: value.parentNodeIndices as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
