import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly minimumClusterLength: number;
}>;
export type Output = Readonly<{
  readonly clusterStarts: readonly number[];
  readonly clusterCount: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.minimumClusterLength) ||
    input.minimumClusterLength < 1
  )
    simpleError(
      "minimumClusterLength",
      "Positive integer basic cluster length required.",
    );
  const clusterStarts: number[] = [];
  for (let i = 0; i < s.length;) {
    if (!"KR".includes(s[i])) {
      i++;
      continue;
    }
    let j = i;
    while (j < s.length && "KR".includes(s[j])) j++;
    if (j - i >= input.minimumClusterLength) clusterStarts.push(i);
    i = j;
  }
  return { clusterStarts, clusterCount: clusterStarts.length };
};
export const exampleInput = {
  sequence: "AKKKKA",
  minimumClusterLength: 4,
} satisfies Input;
export const exampleOutput = {
  clusterStarts: [1],
  clusterCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/nuclear-localization-clusters",
  title: "Nuclear Localization Clusters",
  description:
    "Scan basic Lys/Arg clusters as nuclear-localization-signal candidates.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "minimumClusterLength",
      label: "Minimum cluster length",
      kind: "number",
    },
  ],
  outputs: [
    { id: "clusterStarts", label: "Cluster starts", kind: "numberList" },
    { id: "clusterCount", label: "Cluster count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      minimumClusterLength: value.minimumClusterLength as number,
    }),
});
export const run = tool.execute;
export default tool;
