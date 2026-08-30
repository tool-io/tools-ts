import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly positiveChildren: number;
  readonly childrenTested: number;
  readonly maximumAllowedPositives: number;
}>;
export type Output = Readonly<{
  readonly surveyPositivePercent: number;
  readonly passesCountCriterion: boolean;
  readonly marginChildren: number;
}>;
export const calculate = (input: Input): Output => {
  count(input.positiveChildren, "positiveChildren");
  count(input.childrenTested, "childrenTested", 1);
  count(input.maximumAllowedPositives, "maximumAllowedPositives");
  if (
    input.positiveChildren > input.childrenTested ||
    input.maximumAllowedPositives > input.childrenTested
  )
    simpleError(
      "positiveChildren",
      "Positives and supplied count criterion must fit sample size.",
    );
  return {
    surveyPositivePercent:
      (100 * input.positiveChildren) / input.childrenTested,
    passesCountCriterion:
      input.positiveChildren <= input.maximumAllowedPositives,
    marginChildren: input.maximumAllowedPositives - input.positiveChildren,
  };
};
export const exampleInput = {
  positiveChildren: 5,
  childrenTested: 100,
  maximumAllowedPositives: 6,
} satisfies Input;
export const exampleOutput = {
  surveyPositivePercent: 5,
  passesCountCriterion: true,
  marginChildren: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/survey-positive-count-gate",
  title: "Survey Positive Count Gate",
  description:
    "Compare a transmission-assessment survey positive count with a caller-provided design-specific limit.",
  inputs: [
    { id: "positiveChildren", label: "Positive children", kind: "integer" },
    { id: "childrenTested", label: "Children tested", kind: "integer" },
    {
      id: "maximumAllowedPositives",
      label: "Maximum allowed positives",
      kind: "integer",
    },
  ],
  outputs: [
    {
      id: "surveyPositivePercent",
      label: "Survey positive percent",
      kind: "number",
    },
    {
      id: "passesCountCriterion",
      label: "Passes count criterion",
      kind: "boolean",
    },
    { id: "marginChildren", label: "Margin children", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      positiveChildren: value.positiveChildren as number,
      childrenTested: value.childrenTested as number,
      maximumAllowedPositives: value.maximumAllowedPositives as number,
    }),
});
export const run = tool.execute;
export default tool;
