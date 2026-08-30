import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly referenceGeneIds: readonly string[];
  readonly ctReplicates: readonly (readonly number[])[];
  readonly maximumStdDev: number;
}>;
export type Output = Readonly<{
  readonly stableGeneIds: readonly string[];
  readonly standardDeviations: readonly number[];
}>;

export const calculate = (input: Input): Output => {
  const n = input.referenceGeneIds.length;
  if (
    n === 0 ||
    n !== input.ctReplicates.length ||
    input.ctReplicates.some((r) => r.length < 2)
  )
    simpleError(
      "ctReplicates",
      "Each reference gene needs at least two aligned Ct replicates.",
    );
  const standardDeviations = input.ctReplicates.map((r) => {
    const mean = r.reduce((a, b) => a + b, 0) / r.length;
    return Math.sqrt(r.reduce((s, v) => s + (v - mean) ** 2, 0) / r.length);
  });
  return {
    stableGeneIds: input.referenceGeneIds.filter(
      (_, i) => standardDeviations[i] <= input.maximumStdDev,
    ),
    standardDeviations,
  };
};

export const exampleInput = {
  referenceGeneIds: ["a", "b"],
  ctReplicates: [
    [20, 20, 20],
    [20, 22, 24],
  ],
  maximumStdDev: 1,
} satisfies Input;
export const exampleOutput = {
  stableGeneIds: ["a"],
  standardDeviations: [0, 1.632993161855452],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/bestkeeper-stability",
  title: "Bestkeeper Stability",
  description:
    "Screen reference-gene Ct stability by replicate standard deviation.",
  inputs: [
    { id: "referenceGeneIds", kind: "stringList", label: "Reference gene ids" },
    { id: "ctReplicates", kind: "matrix", label: "Ct replicates" },
    { id: "maximumStdDev", kind: "number", label: "Maximum std dev" },
  ],
  outputs: [
    { id: "stableGeneIds", kind: "stringList", label: "Stable gene ids" },
    {
      id: "standardDeviations",
      kind: "numberList",
      label: "Standard deviations",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceGeneIds: value.referenceGeneIds as readonly string[],
      ctReplicates: value.ctReplicates as readonly (readonly number[])[],
      maximumStdDev: value.maximumStdDev as number,
    }),
});
export const run = tool.execute;
export default tool;
