import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  count,
  aligned,
  maximum,
  binary,
} from "../shared.js";
export type Input = Readonly<{
  readonly enqueuedDayOrdinals: readonly number[];
  readonly completedFlags: readonly number[];
  readonly completionDayOrdinals: readonly number[];
  readonly asOfDayOrdinal: number;
}>;
export type Output = Readonly<{
  readonly observedBacklogAgesDays: readonly number[];
  readonly openBacklogCount: number;
  readonly maximumOpenBacklogAgeDays: number;
}>;
const inputFields = [
  {
    id: "enqueuedDayOrdinals",
    label: "Enqueued day ordinals",
    kind: "numberList",
  },
  { id: "completedFlags", label: "Completed flags", kind: "numberList" },
  {
    id: "completionDayOrdinals",
    label: "Completion day ordinals",
    kind: "numberList",
  },
  { id: "asOfDayOrdinal", label: "As of day ordinal", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.enqueuedDayOrdinals.forEach((v) => count(v, "enqueuedDayOrdinals"));
  input.completionDayOrdinals.forEach((v) => count(v, "completionDayOrdinals"));
  count(input.asOfDayOrdinal, "asOfDayOrdinal");
  aligned(
    input.enqueuedDayOrdinals,
    input.completedFlags,
    "enqueuedDayOrdinals",
  );
  aligned(
    input.enqueuedDayOrdinals,
    input.completionDayOrdinals,
    "enqueuedDayOrdinals",
  );
  binary(input.completedFlags, "completed");
  if (
    input.enqueuedDayOrdinals.some(
      (v, i) =>
        v > input.asOfDayOrdinal ||
        (input.completedFlags[i] &&
          (input.completionDayOrdinals[i] < v ||
            input.completionDayOrdinals[i] > input.asOfDayOrdinal)),
    )
  )
    simpleError(
      "dates",
      "Coherent enqueue/as-of/completion ordinals required.",
    );
  const ages = input.enqueuedDayOrdinals.map(
      (v, i) =>
        (input.completedFlags[i]
          ? input.completionDayOrdinals[i]
          : input.asOfDayOrdinal) - v,
    ),
    open = ages.filter((_, i) => input.completedFlags[i] === 0);
  return {
    observedBacklogAgesDays: ages,
    openBacklogCount: open.length,
    maximumOpenBacklogAgeDays: open.length ? maximum(open) : 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  enqueuedDayOrdinals: [10, 20],
  completedFlags: [0, 1],
  completionDayOrdinals: [0, 25],
  asOfDayOrdinal: 30,
} satisfies Input;
export const exampleOutput = {
  observedBacklogAgesDays: [20, 5],
  openBacklogCount: 1,
  maximumOpenBacklogAgeDays: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/treatment-backlog-aging-days",
  title: "Conservation Treatment Backlog Aging Days Calculator",
  description:
    "Retain closed service time versus right-censored open backlog age with explicit status, rather than age every completed object to today; zero maximum means no open records.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBacklogAgesDays",
      label: "Observed backlog ages days",
      kind: "numberList",
    },
    { id: "openBacklogCount", label: "Open backlog count", kind: "number" },
    {
      id: "maximumOpenBacklogAgeDays",
      label: "Maximum open backlog age days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      enqueuedDayOrdinals: value.enqueuedDayOrdinals as readonly number[],
      completedFlags: value.completedFlags as readonly number[],
      completionDayOrdinals: value.completionDayOrdinals as readonly number[],
      asOfDayOrdinal: value.asOfDayOrdinal as number,
    }),
});
export const run = tool.execute;
export default tool;
