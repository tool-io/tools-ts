import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly probeIds: readonly string[];
  readonly crossReactiveIds: readonly string[];
  readonly snpAffectedIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly retainedIds: readonly string[];
  readonly flaggedIds: readonly string[];
  readonly retainedPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.probeIds.length === 0)
    simpleError("probeIds", "At least one probe is required.");
  const flagged = new Set([...input.crossReactiveIds, ...input.snpAffectedIds]);
  const retainedIds = input.probeIds.filter((v) => !flagged.has(v)),
    flaggedIds = input.probeIds.filter((v) => flagged.has(v));
  return {
    retainedIds,
    flaggedIds,
    retainedPercent: (retainedIds.length / input.probeIds.length) * 100,
  };
};

export const exampleInput = {
  probeIds: ["a", "b", "c"],
  crossReactiveIds: ["b"],
  snpAffectedIds: ["c"],
} satisfies Input;
export const exampleOutput = {
  retainedIds: ["a"],
  flaggedIds: ["b", "c"],
  retainedPercent: 33.33333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/probe-risk-filter",
  title: "Probe Risk Filter",
  description:
    "Filter probes against caller-supplied SNP-affected and cross-reactive ID lists.",
  inputs: [
    { id: "probeIds", kind: "stringList", label: "Probe ids" },
    { id: "crossReactiveIds", kind: "stringList", label: "Cross reactive ids" },
    { id: "snpAffectedIds", kind: "stringList", label: "Snp affected ids" },
  ],
  outputs: [
    { id: "retainedIds", kind: "stringList", label: "Retained ids" },
    { id: "flaggedIds", kind: "stringList", label: "Flagged ids" },
    { id: "retainedPercent", kind: "number", label: "Retained percent" },
  ],
  calculate: (value) =>
    calculate({
      probeIds: value.probeIds as readonly string[],
      crossReactiveIds: value.crossReactiveIds as readonly string[],
      snpAffectedIds: value.snpAffectedIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
