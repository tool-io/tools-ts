import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCrownThirdInfectionRatings: readonly number[];
  readonly knownCrownThirdAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownHawksworthRatingSubtotal: number;
  readonly wholeCrownHawksworthLowerBound: number;
  readonly wholeCrownHawksworthUpperBound: number;
  readonly allThirdsAssessed: boolean;
}>;
const inputFields = [
  {
    id: "observedCrownThirdInfectionRatings",
    label: "Observed crown third infection ratings",
    kind: "numberList",
  },
  {
    id: "knownCrownThirdAssessmentFlags",
    label: "Known crown third assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.observedCrownThirdInfectionRatings.length !== 3 ||
    input.knownCrownThirdAssessmentFlags.length !== 3
  )
    simpleError(
      "thirds",
      "Exactly three lower/middle/upper crown thirds required.",
    );
  binary(input.knownCrownThirdAssessmentFlags, "known");
  input.observedCrownThirdInfectionRatings.forEach((v) =>
    bounded(v, "rating", 0, 2),
  );
  const known = sum(
      input.observedCrownThirdInfectionRatings.filter(
        (_, i) => input.knownCrownThirdAssessmentFlags[i],
      ),
    ),
    unknown = input.knownCrownThirdAssessmentFlags.filter((v) => !v).length;
  return {
    knownHawksworthRatingSubtotal: known,
    wholeCrownHawksworthLowerBound: known,
    wholeCrownHawksworthUpperBound: known + 2 * unknown,
    allThirdsAssessed: unknown === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCrownThirdInfectionRatings: [0, 1, 2],
  knownCrownThirdAssessmentFlags: [1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  knownHawksworthRatingSubtotal: 2,
  wholeCrownHawksworthLowerBound: 2,
  wholeCrownHawksworthUpperBound: 4,
  allThirdsAssessed: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/mistletoe-infection-rating-hawksworth-six-class",
  title: "Hawksworth Six-Class Mistletoe Rating",
  description:
    "Hawksworth six-class sum of independently rated crown thirds0–2, retain unknown-third rating bounds; no pathogen identity or full rating from missing evidence. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownHawksworthRatingSubtotal",
      label: "Known hawksworth rating subtotal",
      kind: "number",
    },
    {
      id: "wholeCrownHawksworthLowerBound",
      label: "Whole crown hawksworth lower bound",
      kind: "number",
    },
    {
      id: "wholeCrownHawksworthUpperBound",
      label: "Whole crown hawksworth upper bound",
      kind: "number",
    },
    { id: "allThirdsAssessed", label: "All thirds assessed", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observedCrownThirdInfectionRatings:
        value.observedCrownThirdInfectionRatings as readonly number[],
      knownCrownThirdAssessmentFlags:
        value.knownCrownThirdAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
