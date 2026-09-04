import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedFineFuelTrialWeights: readonly number[];
  readonly observedIgnitionFlags: readonly number[];
  readonly knownIgnitionAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownWeightedIgnitionFraction: number;
  readonly unassessedTrialWeightFraction: number;
}>;
const inputFields = [
  {
    id: "observedFineFuelTrialWeights",
    label: "Observed fine fuel trial weights",
    kind: "numberList",
  },
  {
    id: "observedIgnitionFlags",
    label: "Observed ignition flags",
    kind: "numberList",
  },
  {
    id: "knownIgnitionAssessmentFlags",
    label: "Known ignition assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFineFuelTrialWeights.forEach((v) =>
    nonnegative(v, "observedFineFuelTrialWeights"),
  );
  binary(input.observedIgnitionFlags, "observedIgnitionFlags");
  binary(input.knownIgnitionAssessmentFlags, "knownIgnitionAssessmentFlags");
  aligned(
    input.observedFineFuelTrialWeights,
    input.observedIgnitionFlags,
    "observedFineFuelTrialWeights",
  );
  aligned(
    input.observedFineFuelTrialWeights,
    input.knownIgnitionAssessmentFlags,
    "observedFineFuelTrialWeights",
  );
  const known = sum(
      input.observedFineFuelTrialWeights.filter(
        (_, i) => input.knownIgnitionAssessmentFlags[i],
      ),
    ),
    total = sum(input.observedFineFuelTrialWeights);
  positive(known, "known");
  positive(total, "total");
  return {
    knownWeightedIgnitionFraction:
      sum(
        input.observedFineFuelTrialWeights.filter(
          (_, i) =>
            input.knownIgnitionAssessmentFlags[i] &&
            input.observedIgnitionFlags[i],
        ),
      ) / known,
    unassessedTrialWeightFraction: 1 - known / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFineFuelTrialWeights: [1, 2, 1],
  observedIgnitionFlags: [1, 0, 1],
  knownIgnitionAssessmentFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  knownWeightedIgnitionFraction: 0.3333333333333333,
  unassessedTrialWeightFraction: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/probability-of-ignition-from-fine-fuel",
  title: "Probability of Ignition From Fine Fuel Calculator",
  description:
    "Summarize already observed independently matched fine-fuel ignition outcomes and unknown assessments, not fire experimentation instructions or a validated ignition probability forecast. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownWeightedIgnitionFraction",
      label: "Known weighted ignition fraction",
      kind: "number",
    },
    {
      id: "unassessedTrialWeightFraction",
      label: "Unassessed trial weight fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFineFuelTrialWeights:
        value.observedFineFuelTrialWeights as readonly number[],
      observedIgnitionFlags: value.observedIgnitionFlags as readonly number[],
      knownIgnitionAssessmentFlags:
        value.knownIgnitionAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
