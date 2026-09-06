import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedLessonVideoSeconds: readonly number[];
  readonly callerContextVideoBudgetSeconds: number;
  readonly knownVideoDurationsFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownOverBudgetVideoIndices: readonly number[];
  readonly unknownVideoDurationIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedLessonVideoSeconds",
    label: "Observed lesson video seconds",
    kind: "numberList",
  },
  {
    id: "callerContextVideoBudgetSeconds",
    label: "Caller context video budget seconds",
    kind: "number",
  },
  {
    id: "knownVideoDurationsFlags",
    label: "Known video durations flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerContextVideoBudgetSeconds,
    "callerContextVideoBudgetSeconds",
  );
  input.observedLessonVideoSeconds.forEach((v) =>
    nonnegative(v, "observedLessonVideoSeconds"),
  );
  binary(input.knownVideoDurationsFlags, "knownVideoDurationsFlags");
  aligned(
    input.observedLessonVideoSeconds,
    input.knownVideoDurationsFlags,
    "observedLessonVideoSeconds",
  );
  return {
    knownOverBudgetVideoIndices: input.observedLessonVideoSeconds.flatMap(
      (v, i) =>
        input.knownVideoDurationsFlags[i] &&
        v > input.callerContextVideoBudgetSeconds
          ? [i]
          : [],
    ),
    unknownVideoDurationIndices: input.knownVideoDurationsFlags.flatMap(
      (v, i) => (!v ? [i] : []),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLessonVideoSeconds: [300, 420],
  callerContextVideoBudgetSeconds: 360,
  knownVideoDurationsFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownOverBudgetVideoIndices: [],
  unknownVideoDurationIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/flipped-classroom-video-six-minute-best-practice",
  title: "Flipped Classroom Video Six Minute Best Practice",
  description:
    "Audit independently measured lesson-video durations against the caller's context-specific budget. Preserve unknown durations separately; six minutes is not a universal causal best-practice threshold or an accessibility guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownOverBudgetVideoIndices",
      label: "Known over budget video indices",
      kind: "numberList",
    },
    {
      id: "unknownVideoDurationIndices",
      label: "Unknown video duration indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLessonVideoSeconds:
        value.observedLessonVideoSeconds as readonly number[],
      callerContextVideoBudgetSeconds:
        value.callerContextVideoBudgetSeconds as number,
      knownVideoDurationsFlags:
        value.knownVideoDurationsFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
