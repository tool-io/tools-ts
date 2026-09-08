import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredPerchlorateMassFraction: number;
  readonly callerIndependentlyApplicableScreenFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredPerchlorateMassFraction",
    label: "Independently measured perchlorate mass fraction",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicableScreenFraction",
    label: "Caller independently applicable screen fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.independentlyMeasuredPerchlorateMassFraction, "concentration");
  fraction(input.callerIndependentlyApplicableScreenFraction, "screen");
  return {
    signedThresholdExcessFraction:
      input.independentlyMeasuredPerchlorateMassFraction -
      input.callerIndependentlyApplicableScreenFraction,
    exceedsCallerScreen:
      input.independentlyMeasuredPerchlorateMassFraction >
      input.callerIndependentlyApplicableScreenFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredPerchlorateMassFraction: 0.01,
    callerIndependentlyApplicableScreenFraction: 0.005,
  },
  output: {
    result: { signedThresholdExcessFraction: 0.005, exceedsCallerScreen: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/perchlorate-soil-risk-classifier",
  title:
    "Perchlorate Soil Toxicity Mars Regolith Concentration Risk Classifier",
  description:
    "Measured soil-perchlorate mass fraction compared only with independently applicable research/exposure screen. No universal Martian soil toxicity, human exposure threshold, habitability or safe handling certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
