import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction, count } from "../shared.js";
export type Input = Readonly<{
  readonly targetHarvestFishCount: number;
  readonly conditionalSurvivalFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly overallExpectedSurvivalFraction: number;
  readonly requiredInitialFryCount: number;
  readonly expectedHarvestFishCount: number;
}>;
const inputFields = [
  {
    id: "targetHarvestFishCount",
    label: "Target harvest fish count",
    kind: "integer",
  },
  {
    id: "conditionalSurvivalFractions",
    label: "Conditional survival fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.conditionalSurvivalFractions.forEach((v) =>
    positive(v, "conditionalSurvivalFractions"),
  );
  input.conditionalSurvivalFractions.forEach((v) =>
    fraction(v, "conditionalSurvivalFractions"),
  );
  count(input.targetHarvestFishCount, "targetHarvestFishCount");
  if (!input.conditionalSurvivalFractions.length)
    simpleError(
      "conditionalSurvivalFractions",
      "Nonempty conditional survival stages required.",
    );
  const overallExpectedSurvivalFraction = positive(
      input.conditionalSurvivalFractions.reduce((a, b) => a * b, 1),
      "conditionalSurvivalFractions",
    ),
    requiredInitialFryCount = count(
      Math.ceil(input.targetHarvestFishCount / overallExpectedSurvivalFraction),
      "requiredInitialFryCount",
    );
  return {
    overallExpectedSurvivalFraction,
    requiredInitialFryCount,
    expectedHarvestFishCount:
      requiredInitialFryCount * overallExpectedSurvivalFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  targetHarvestFishCount: 1000,
  conditionalSurvivalFractions: [0.8, 0.5],
} satisfies Input;
export const exampleOutput = {
  overallExpectedSurvivalFraction: 0.4,
  requiredInitialFryCount: 2500,
  expectedHarvestFishCount: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/fry-stocking",
  title: "Fry Stocking",
  description:
    "Invert serial expected survival to a rounded initial fry count; an expectation-based plan, not a probability guarantee or density recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "overallExpectedSurvivalFraction",
      label: "Overall expected survival fraction",
      kind: "number",
    },
    {
      id: "requiredInitialFryCount",
      label: "Required initial fry count",
      kind: "number",
    },
    {
      id: "expectedHarvestFishCount",
      label: "Expected harvest fish count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      targetHarvestFishCount: value.targetHarvestFishCount as number,
      conditionalSurvivalFractions:
        value.conditionalSurvivalFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
