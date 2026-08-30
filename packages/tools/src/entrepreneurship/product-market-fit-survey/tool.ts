import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly veryDisappointedResponses: number;
  readonly totalResponses: number;
  readonly minimumPmfFraction: number;
}>;
export type Output = Readonly<{
  readonly veryDisappointedPercent: number;
  readonly meetsSurveyThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.totalResponses) ||
    input.totalResponses < 1 ||
    !Number.isSafeInteger(input.veryDisappointedResponses) ||
    input.veryDisappointedResponses < 0 ||
    input.veryDisappointedResponses > input.totalResponses ||
    input.minimumPmfFraction < 0 ||
    input.minimumPmfFraction > 1
  )
    simpleError(
      "totalResponses",
      "Valid survey response counts and caller threshold within [0,1] required.",
    );
  const fraction = input.veryDisappointedResponses / input.totalResponses;
  return {
    veryDisappointedPercent: 100 * fraction,
    meetsSurveyThreshold: fraction >= input.minimumPmfFraction,
  };
};
export const exampleInput = {
  veryDisappointedResponses: 4,
  totalResponses: 10,
  minimumPmfFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  veryDisappointedPercent: 40,
  meetsSurveyThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/product-market-fit-survey",
  title: "Product Market Fit Survey",
  description:
    "Score the Sean Ellis very-disappointed survey against a supplied PMF cutoff.",
  inputs: [
    {
      id: "veryDisappointedResponses",
      label: "Very disappointed responses",
      kind: "number",
    },
    { id: "totalResponses", label: "Total responses", kind: "number" },
    { id: "minimumPmfFraction", label: "Minimum pmf fraction", kind: "number" },
  ],
  outputs: [
    {
      id: "veryDisappointedPercent",
      label: "Very disappointed percent",
      kind: "number",
    },
    {
      id: "meetsSurveyThreshold",
      label: "Meets survey threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      veryDisappointedResponses: value.veryDisappointedResponses as number,
      totalResponses: value.totalResponses as number,
      minimumPmfFraction: value.minimumPmfFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
