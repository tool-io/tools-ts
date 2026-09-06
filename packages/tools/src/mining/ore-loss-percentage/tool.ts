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
  binary,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedCalledOreTonnes: readonly number[];
  readonly observedUnrecoveredOreTonnes: readonly number[];
  readonly knownLossAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownOreLossFraction: number;
  readonly unknownCalledOreTonnes: number;
}>;
const inputFields = [
  {
    id: "observedCalledOreTonnes",
    label: "Observed called ore tonnes",
    kind: "numberList",
  },
  {
    id: "observedUnrecoveredOreTonnes",
    label: "Observed unrecovered ore tonnes",
    kind: "numberList",
  },
  {
    id: "knownLossAssessmentFlags",
    label: "Known loss assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCalledOreTonnes.forEach((v) =>
    positive(v, "observedCalledOreTonnes"),
  );
  input.observedUnrecoveredOreTonnes.forEach((v) =>
    nonnegative(v, "observedUnrecoveredOreTonnes"),
  );
  binary(input.knownLossAssessmentFlags, "knownLossAssessmentFlags");
  aligned(
    input.observedCalledOreTonnes,
    input.observedUnrecoveredOreTonnes,
    "observedCalledOreTonnes",
  );
  aligned(
    input.observedCalledOreTonnes,
    input.knownLossAssessmentFlags,
    "observedCalledOreTonnes",
  );
  input.observedUnrecoveredOreTonnes.forEach((v, i) => {
    if (
      input.knownLossAssessmentFlags[i] &&
      v > input.observedCalledOreTonnes[i]
    )
      simpleError("loss", "Measured unrecovered≤matched called ore.");
  });
  const called = sum(
    input.observedCalledOreTonnes.filter(
      (_, i) => input.knownLossAssessmentFlags[i],
    ),
  );
  positive(called, "known called");
  return {
    knownOreLossFraction:
      sum(
        input.observedUnrecoveredOreTonnes.filter(
          (_, i) => input.knownLossAssessmentFlags[i],
        ),
      ) / called,
    unknownCalledOreTonnes: sum(
      input.observedCalledOreTonnes.filter(
        (_, i) => !input.knownLossAssessmentFlags[i],
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCalledOreTonnes: [10, 20],
  observedUnrecoveredOreTonnes: [1, 4],
  knownLossAssessmentFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownOreLossFraction: 0.1,
  unknownCalledOreTonnes: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-loss-percentage",
  title: "Ore Loss Percentage Calculator",
  description:
    "Audit independently assessed unrecovered ore separately from unassessed called inventory, not recovered ore minus diluent or plant metal recovery. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownOreLossFraction",
      label: "Known ore loss fraction",
      kind: "number",
    },
    {
      id: "unknownCalledOreTonnes",
      label: "Unknown called ore tonnes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCalledOreTonnes:
        value.observedCalledOreTonnes as readonly number[],
      observedUnrecoveredOreTonnes:
        value.observedUnrecoveredOreTonnes as readonly number[],
      knownLossAssessmentFlags:
        value.knownLossAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
