import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, at } from "../batch-shared.js";
export type Input = Readonly<{
  readonly relativePitchSamples: readonly number[];
  readonly callerFlatExcursionTolerance: number;
}>;
export type Output = Readonly<{
  readonly observedToneShape: string;
  readonly observedPitchExcursion: number;
  readonly signedFinalMinusInitialPitch: number;
  readonly significantTrendSwitchCount: number;
}>;
const inputFields = [
  {
    id: "relativePitchSamples",
    label: "Relative pitch samples",
    kind: "numberList",
  },
  {
    id: "callerFlatExcursionTolerance",
    label: "Caller flat excursion tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerFlatExcursionTolerance,
    "callerFlatExcursionTolerance",
  );
  if (
    input.relativePitchSamples.length < 2 ||
    input.relativePitchSamples.some((v) => v < 0 || v > 10) ||
    input.callerFlatExcursionTolerance > 10
  )
    simpleError(
      "samples",
      "At least two relative pitch levels in [0,10] and caller tolerance ≤10 required.",
    );
  const excursion =
      Math.max(...input.relativePitchSamples) -
      Math.min(...input.relativePitchSamples),
    signs = input.relativePitchSamples
      .slice(1)
      .map((v, i) => v - input.relativePitchSamples[i])
      .filter((d) => Math.abs(d) > input.callerFlatExcursionTolerance)
      .map(Math.sign),
    switches = signs.slice(1).filter((s, i) => s !== signs[i]).length,
    label =
      excursion <= input.callerFlatExcursionTolerance
        ? "register-flat"
        : switches === 0 && signs.length
          ? signs[0] > 0
            ? "rising-contour"
            : "falling-contour"
          : switches === 1
            ? signs[0] > 0
              ? "rising-falling-contour"
              : "falling-rising-contour"
            : "complex-or-subthreshold-contour";
  return {
    observedToneShape: label,
    observedPitchExcursion: excursion,
    signedFinalMinusInitialPitch:
      input.relativePitchSamples.at(-1)! - input.relativePitchSamples[0],
    significantTrendSwitchCount: switches,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relativePitchSamples: [2, 2, 2],
  callerFlatExcursionTolerance: 0,
} satisfies Input;
export const exampleOutput = {
  observedToneShape: "register-flat",
  observedPitchExcursion: 0,
  signedFinalMinusInitialPitch: 0,
  significantTrendSwitchCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/tone-register-vs-contour-classifier",
  title: "Register vs Contour Tone Classifier",
  description:
    "Screen observed relative pitch trajectory under explicit tolerance for flat versus rising/falling/turning contour, preserving complex/subthreshold evidence; not a language’s tone-system classification or fundamental-frequency extraction.",
  inputs: inputFields,
  outputs: [
    { id: "observedToneShape", label: "Observed tone shape", kind: "string" },
    {
      id: "observedPitchExcursion",
      label: "Observed pitch excursion",
      kind: "number",
    },
    {
      id: "signedFinalMinusInitialPitch",
      label: "Signed final minus initial pitch",
      kind: "number",
    },
    {
      id: "significantTrendSwitchCount",
      label: "Significant trend switch count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      relativePitchSamples: value.relativePitchSamples as readonly number[],
      callerFlatExcursionTolerance:
        value.callerFlatExcursionTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
