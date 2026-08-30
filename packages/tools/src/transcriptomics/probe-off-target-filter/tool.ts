import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly probeIds: readonly string[];
  readonly bestOffTargetIdentityPercents: readonly number[];
  readonly maximumOffTargetIdentityPercent: number;
}>;
export type Output = Readonly<{
  readonly retainedProbeIds: readonly string[];
  readonly filteredProbeIds: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  if (
    input.probeIds.length === 0 ||
    input.probeIds.length !== input.bestOffTargetIdentityPercents.length ||
    input.bestOffTargetIdentityPercents.some((v) => v < 0 || v > 100)
  )
    simpleError(
      "probeIds",
      "Aligned probes and percent identities are required.",
    );
  return {
    retainedProbeIds: input.probeIds.filter(
      (_, i) =>
        input.bestOffTargetIdentityPercents[i] <
        input.maximumOffTargetIdentityPercent,
    ),
    filteredProbeIds: input.probeIds.filter(
      (_, i) =>
        input.bestOffTargetIdentityPercents[i] >=
        input.maximumOffTargetIdentityPercent,
    ),
  };
};

export const exampleInput = {
  probeIds: ["a", "b", "c"],
  bestOffTargetIdentityPercents: [40, 95, 70],
  maximumOffTargetIdentityPercent: 80,
} satisfies Input;
export const exampleOutput = {
  retainedProbeIds: ["a", "c"],
  filteredProbeIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/probe-off-target-filter",
  title: "Probe Off Target Filter",
  description:
    "Filter array probes by caller-supplied best off-target sequence identity.",
  inputs: [
    { id: "probeIds", kind: "stringList", label: "Probe ids" },
    {
      id: "bestOffTargetIdentityPercents",
      kind: "numberList",
      label: "Best off target identity percents",
    },
    {
      id: "maximumOffTargetIdentityPercent",
      kind: "number",
      label: "Maximum off target identity percent",
    },
  ],
  outputs: [
    { id: "retainedProbeIds", kind: "stringList", label: "Retained probe ids" },
    { id: "filteredProbeIds", kind: "stringList", label: "Filtered probe ids" },
  ],
  calculate: (value) =>
    calculate({
      probeIds: value.probeIds as readonly string[],
      bestOffTargetIdentityPercents:
        value.bestOffTargetIdentityPercents as readonly number[],
      maximumOffTargetIdentityPercent:
        value.maximumOffTargetIdentityPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
