import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  unique,
  strictlyIncreasing,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerBreakingSectionLabels: readonly string[];
  readonly sectionStartSeconds: readonly number[];
  readonly setEndSeconds: number;
  readonly callerMinimumSectionSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly sectionDurationsSeconds: readonly number[];
  readonly sectionsBelowCallerDurationPlan: readonly string[];
}>;
const inputFields = [
  {
    id: "callerBreakingSectionLabels",
    label: "Caller breaking section labels",
    kind: "stringList",
  },
  {
    id: "sectionStartSeconds",
    label: "Section start seconds",
    kind: "numberList",
  },
  { id: "setEndSeconds", label: "Set end seconds", kind: "number" },
  {
    id: "callerMinimumSectionSeconds",
    label: "Caller minimum section seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.setEndSeconds, "setEndSeconds");
  input.callerMinimumSectionSeconds.forEach((v) =>
    nonnegative(v, "callerMinimumSectionSeconds"),
  );
  aligned(
    input.callerBreakingSectionLabels,
    input.sectionStartSeconds,
    "callerBreakingSectionLabels",
  );
  aligned(
    input.callerBreakingSectionLabels,
    input.callerMinimumSectionSeconds,
    "callerBreakingSectionLabels",
  );
  unique(input.callerBreakingSectionLabels, "sections");
  sequence(input.sectionStartSeconds, "starts");
  strictlyIncreasing(input.sectionStartSeconds, "starts", 1);
  if (
    input.sectionStartSeconds[0] !== 0 ||
    input.sectionStartSeconds.at(-1)! >= input.setEndSeconds
  )
    simpleError(
      "set",
      "Starts begin zero and precede explicit breaking set end.",
    );
  const ends = [...input.sectionStartSeconds.slice(1), input.setEndSeconds],
    d = ends.map((v, i) => v - input.sectionStartSeconds[i]);
  return {
    sectionDurationsSeconds: d,
    sectionsBelowCallerDurationPlan: input.callerBreakingSectionLabels.filter(
      (_, i) => d[i] < input.callerMinimumSectionSeconds[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBreakingSectionLabels: ["toprock", "downrock", "freeze"],
  sectionStartSeconds: [0, 10, 25],
  setEndSeconds: 30,
  callerMinimumSectionSeconds: [5, 10, 3],
} satisfies Input;
export const exampleOutput = {
  sectionDurationsSeconds: [10, 15, 5],
  sectionsBelowCallerDurationPlan: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/toprock-downrock-freeze-set-structure-lookup",
  title: "Toprock Downrock Freeze Set Structure Lookup",
  description:
    "Reconcile actual caller breaking-set annotated section durations and minima without prescribing lineage, universal top/down/freeze ordering or power-move readiness.",
  inputs: inputFields,
  outputs: [
    {
      id: "sectionDurationsSeconds",
      label: "Section durations seconds",
      kind: "numberList",
    },
    {
      id: "sectionsBelowCallerDurationPlan",
      label: "Sections below caller duration plan",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBreakingSectionLabels:
        value.callerBreakingSectionLabels as readonly string[],
      sectionStartSeconds: value.sectionStartSeconds as readonly number[],
      setEndSeconds: value.setEndSeconds as number,
      callerMinimumSectionSeconds:
        value.callerMinimumSectionSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
