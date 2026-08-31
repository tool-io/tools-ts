import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  identifier,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerFamilyNodeNames: readonly string[];
  readonly callerParentNodeIndices: readonly number[];
  readonly selectedNodeName: string;
}>;
export type Output = Readonly<{
  readonly selectedNodeDepth: number;
  readonly selectedLeafToRootLineage: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFamilyNodeNames",
    label: "Caller family node names",
    kind: "stringList",
  },
  {
    id: "callerParentNodeIndices",
    label: "Caller parent node indices",
    kind: "numberList",
  },
  { id: "selectedNodeName", label: "Selected node name", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerFamilyNodeNames,
    input.callerParentNodeIndices,
    "callerFamilyNodeNames",
  );
  input.callerFamilyNodeNames.forEach(identifier);
  if (
    new Set(input.callerFamilyNodeNames).size !==
    input.callerFamilyNodeNames.length
  )
    simpleError("names", "Distinct explicit family nodes required.");
  const n = input.callerFamilyNodeNames.length;
  input.callerParentNodeIndices.forEach((v) => {
    if (v !== -1) bounded(v, "parent", 0, n - 1);
  });
  for (let i = 0; i < n; i++) {
    const seen = new Set<number>();
    let j = i;
    while (j !== -1) {
      if (seen.has(j))
        simpleError("parents", "Acyclic one-parent forest required.");
      seen.add(j);
      j = input.callerParentNodeIndices[j];
    }
  }
  const i = input.callerFamilyNodeNames.indexOf(input.selectedNodeName);
  if (i < 0) simpleError("node", "Selected named node must be present.");
  const path: string[] = [];
  let j = i;
  while (j !== -1) {
    path.push(input.callerFamilyNodeNames[j]);
    j = input.callerParentNodeIndices[j];
  }
  return {
    selectedNodeDepth: path.length - 1,
    selectedLeafToRootLineage: path,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFamilyNodeNames: ["IndoEuropean", "Germanic", "English"],
  callerParentNodeIndices: [-1, 0, 1],
  selectedNodeName: "English",
} satisfies Input;
export const exampleOutput = {
  selectedNodeDepth: 2,
  selectedLeafToRootLineage: ["English", "Germanic", "IndoEuropean"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/language-family-tree-depth-lookup",
  title: "Language Family Tree Depth Lookup",
  description:
    "Resolve actual caller family-tree forest depth/lineage with cycle detection and explicit roots, not fixed lineage claims; one-parent model does not represent contact, disputed or overlapping classifications.",
  inputs: inputFields,
  outputs: [
    { id: "selectedNodeDepth", label: "Selected node depth", kind: "number" },
    {
      id: "selectedLeafToRootLineage",
      label: "Selected leaf to root lineage",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFamilyNodeNames: value.callerFamilyNodeNames as readonly string[],
      callerParentNodeIndices:
        value.callerParentNodeIndices as readonly number[],
      selectedNodeName: value.selectedNodeName as string,
    }),
});
export const run = tool.execute;
export default tool;
