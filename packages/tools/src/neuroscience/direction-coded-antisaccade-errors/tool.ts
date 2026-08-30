import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly cueHorizontalDegrees: readonly number[];
  readonly initialSaccadeHorizontalDegrees: readonly number[];
  readonly validTrialFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly validTrialIndexes: readonly number[];
  readonly errorTrialIndexes: readonly number[];
  readonly errorFraction: number;
}>;
const inputFields = [
  {
    id: "cueHorizontalDegrees",
    label: "Cue horizontal degrees",
    kind: "numberList",
  },
  {
    id: "initialSaccadeHorizontalDegrees",
    label: "Initial saccade horizontal degrees",
    kind: "numberList",
  },
  { id: "validTrialFlags", label: "Valid trial flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.cueHorizontalDegrees,
    input.initialSaccadeHorizontalDegrees,
    "cueHorizontalDegrees",
  );
  aligned(
    input.cueHorizontalDegrees,
    input.validTrialFlags,
    "cueHorizontalDegrees",
  );
  input.validTrialFlags.forEach((v) => {
    if (v !== 0 && v !== 1)
      simpleError("validTrialFlags", "Binary valid-trial flags required.");
  });
  const validTrialIndexes = input.validTrialFlags.flatMap((v, i) =>
    v ? [i] : [],
  );
  if (!validTrialIndexes.length)
    simpleError("validTrialFlags", "At least one valid trial required.");
  validTrialIndexes.forEach((i) => {
    if (
      input.cueHorizontalDegrees[i] === 0 ||
      input.initialSaccadeHorizontalDegrees[i] === 0
    )
      simpleError(
        "initialSaccadeHorizontalDegrees",
        "Valid trials require nonzero cue and initial movement directions.",
      );
  });
  const errorTrialIndexes = validTrialIndexes.filter(
    (i) =>
      input.cueHorizontalDegrees[i] * input.initialSaccadeHorizontalDegrees[i] >
      0,
  );
  return {
    validTrialIndexes,
    errorTrialIndexes,
    errorFraction: errorTrialIndexes.length / validTrialIndexes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cueHorizontalDegrees: [-10, 10, 10],
  initialSaccadeHorizontalDegrees: [5, 5, -5],
  validTrialFlags: [1, 1, 1],
} satisfies Input;
export const exampleOutput = {
  validTrialIndexes: [0, 1, 2],
  errorTrialIndexes: [1],
  errorFraction: 0.3333333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/direction-coded-antisaccade-errors",
  title: "Anti-Saccade Error Rate",
  description:
    "Classify initial antisaccade directional errors from signed horizontal cue and eye displacements after supplied valid-trial exclusions; corrective later movements do not erase the initial error.",
  inputs: inputFields,
  outputs: [
    {
      id: "validTrialIndexes",
      label: "Valid trial indexes",
      kind: "numberList",
    },
    {
      id: "errorTrialIndexes",
      label: "Error trial indexes",
      kind: "numberList",
    },
    { id: "errorFraction", label: "Error fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      cueHorizontalDegrees: value.cueHorizontalDegrees as readonly number[],
      initialSaccadeHorizontalDegrees:
        value.initialSaccadeHorizontalDegrees as readonly number[],
      validTrialFlags: value.validTrialFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
