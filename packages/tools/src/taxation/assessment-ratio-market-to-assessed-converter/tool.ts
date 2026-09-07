import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  rateMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly independentlyObservedMarketValueMinor: number;
  readonly callerAssessmentRatioBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly conditionalAssessedValueMinor: number;
}>;
const inputFields = [
  {
    id: "independentlyObservedMarketValueMinor",
    label: "Independently observed market value minor",
    kind: "number",
  },
  {
    id: "callerAssessmentRatioBasisPoints",
    label: "Caller assessment ratio basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.independentlyObservedMarketValueMinor,
    "independentlyObservedMarketValueMinor",
  );
  bounded(input.callerAssessmentRatioBasisPoints, "ratio", 0, 10000);
  return {
    conditionalAssessedValueMinor: rateMinor(
      input.independentlyObservedMarketValueMinor,
      input.callerAssessmentRatioBasisPoints,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyObservedMarketValueMinor: 100,
  callerAssessmentRatioBasisPoints: 8000,
} satisfies Input;
export const exampleOutput = {
  conditionalAssessedValueMinor: 80,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/assessment-ratio-market-to-assessed-converter",
  title: "Assessment Ratio Market To Assessed Converter",
  description:
    "Market value×independently applicable assessment ratio, no appraisal accuracy or property tax amount. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalAssessedValueMinor",
      label: "Conditional assessed value minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyObservedMarketValueMinor:
        value.independentlyObservedMarketValueMinor as number,
      callerAssessmentRatioBasisPoints:
        value.callerAssessmentRatioBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
