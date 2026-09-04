import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedRustGallFlags: readonly number[];
  readonly knownStemSweepAssessmentFlags: readonly number[];
  readonly observedStemSweepLengthsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownStemGallIncidence: number;
  readonly knownGallPositiveSweepExposureFraction: number;
  readonly unassessedStemCount: number;
}>;
const inputFields = [
  {
    id: "observedRustGallFlags",
    label: "Observed rust gall flags",
    kind: "numberList",
  },
  {
    id: "knownStemSweepAssessmentFlags",
    label: "Known stem sweep assessment flags",
    kind: "numberList",
  },
  {
    id: "observedStemSweepLengthsM",
    label: "Observed stem sweep lengths m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedStemSweepLengthsM.forEach((v) =>
    positive(v, "observedStemSweepLengthsM"),
  );
  binary(input.observedRustGallFlags, "observedRustGallFlags");
  binary(input.knownStemSweepAssessmentFlags, "knownStemSweepAssessmentFlags");
  aligned(
    input.observedRustGallFlags,
    input.knownStemSweepAssessmentFlags,
    "observedRustGallFlags",
  );
  aligned(
    input.observedRustGallFlags,
    input.observedStemSweepLengthsM,
    "observedRustGallFlags",
  );
  const known = input.knownStemSweepAssessmentFlags.filter((v) => v).length;
  positive(known, "known stems");
  const length = sum(
    input.observedStemSweepLengthsM.filter(
      (_, i) => input.knownStemSweepAssessmentFlags[i],
    ),
  );
  return {
    knownStemGallIncidence:
      input.observedRustGallFlags.filter(
        (v, i) => v && input.knownStemSweepAssessmentFlags[i],
      ).length / known,
    knownGallPositiveSweepExposureFraction:
      sum(
        input.observedStemSweepLengthsM.filter(
          (_, i) =>
            input.knownStemSweepAssessmentFlags[i] &&
            input.observedRustGallFlags[i],
        ),
      ) / length,
    unassessedStemCount: input.knownStemSweepAssessmentFlags.length - known,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRustGallFlags: [1, 0, 1],
  knownStemSweepAssessmentFlags: [1, 1, 0],
  observedStemSweepLengthsM: [1, 3, 2],
} satisfies Input;
export const exampleOutput = {
  knownStemGallIncidence: 0.5,
  knownGallPositiveSweepExposureFraction: 0.25,
  unassessedStemCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/rust-gall-incidence-percent-stem-sweep-frequency",
  title: "Rust Gall Incidence Stem Sweep Frequency",
  description:
    "Audit independent rust-gall stem flags and actual assessed sweep-length exposure separately, no automatic disease attribution or missing-as-healthy inference. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownStemGallIncidence",
      label: "Known stem gall incidence",
      kind: "number",
    },
    {
      id: "knownGallPositiveSweepExposureFraction",
      label: "Known gall positive sweep exposure fraction",
      kind: "number",
    },
    {
      id: "unassessedStemCount",
      label: "Unassessed stem count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRustGallFlags: value.observedRustGallFlags as readonly number[],
      knownStemSweepAssessmentFlags:
        value.knownStemSweepAssessmentFlags as readonly number[],
      observedStemSweepLengthsM:
        value.observedStemSweepLengthsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
