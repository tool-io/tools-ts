import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned, ids } from "../shared.js";
export type Input = Readonly<{
  readonly contextIds: readonly number[];
  readonly olderToYoungerEdges: readonly (readonly number[])[];
  readonly observedDepthsM: readonly number[];
  readonly callerDepthToleranceM: number;
}>;
export type Output = Readonly<{
  readonly oldestFirstContextIds: readonly number[];
  readonly depthContradictionEdgeFlags: readonly number[];
}>;
const inputFields = [
  { id: "contextIds", label: "Context ids", kind: "numberList" },
  {
    id: "olderToYoungerEdges",
    label: "Older to younger edges",
    kind: "matrix",
  },
  { id: "observedDepthsM", label: "Observed depths m", kind: "numberList" },
  {
    id: "callerDepthToleranceM",
    label: "Caller depth tolerance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedDepthsM.forEach((v) => nonnegative(v, "observedDepthsM"));
  nonnegative(input.callerDepthToleranceM, "callerDepthToleranceM");
  ids(input.contextIds, "contextIds");
  aligned(input.contextIds, input.observedDepthsM, "contexts");
  if (input.olderToYoungerEdges.length > 100000)
    simpleError("edges", "Bounded edge list required.");
  const n = input.contextIds.length,
    index = new Map(input.contextIds.map((v, i) => [v, i])),
    adj = Array.from({ length: n }, () => new Set<number>()),
    indegree = Array<number>(n).fill(0),
    depthContradictionEdgeFlags: number[] = [];
  for (const e of input.olderToYoungerEdges) {
    if (e.length !== 2 || !index.has(e[0]) || !index.has(e[1]) || e[0] === e[1])
      simpleError("edges", "Distinct known context endpoints required.");
    const a = index.get(e[0])!,
      b = index.get(e[1])!;
    if (!adj[a].has(b)) {
      adj[a].add(b);
      indegree[b]++;
    }
    depthContradictionEdgeFlags.push(
      input.observedDepthsM[a] + input.callerDepthToleranceM <
        input.observedDepthsM[b]
        ? 1
        : 0,
    );
  }
  const oldestFirstContextIds: number[] = [],
    done = new Set<number>();
  for (let k = 0; k < n; k++) {
    const i = indegree.findIndex((v, j) => v === 0 && !done.has(j));
    if (i < 0)
      simpleError("edges", "Cyclic Harris relationships cannot be ordered.");
    done.add(i);
    oldestFirstContextIds.push(input.contextIds[i]);
    for (const j of adj[i]) indegree[j]--;
  }
  return { oldestFirstContextIds, depthContradictionEdgeFlags };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  contextIds: [10, 20, 30],
  olderToYoungerEdges: [
    [10, 20],
    [20, 30],
  ],
  observedDepthsM: [3, 2, 1],
  callerDepthToleranceM: 0,
} satisfies Input;
export const exampleOutput = {
  oldestFirstContextIds: [10, 20, 30],
  depthContradictionEdgeFlags: [0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/harris-matrix-depth-order",
  title: "Harris Matrix Depth Order Checker",
  description:
    "Topologically audit supplied older-to-younger Harris relations, reporting measured positive-down depth contradictions without overwriting stratigraphy; input order breaks ties and cycles error.",
  inputs: inputFields,
  outputs: [
    {
      id: "oldestFirstContextIds",
      label: "Oldest first context ids",
      kind: "numberList",
    },
    {
      id: "depthContradictionEdgeFlags",
      label: "Depth contradiction edge flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      contextIds: value.contextIds as readonly number[],
      olderToYoungerEdges:
        value.olderToYoungerEdges as readonly (readonly number[])[],
      observedDepthsM: value.observedDepthsM as readonly number[],
      callerDepthToleranceM: value.callerDepthToleranceM as number,
    }),
});
export const run = tool.execute;
export default tool;
