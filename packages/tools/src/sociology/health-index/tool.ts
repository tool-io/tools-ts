import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedLifeExpectancyYears: number;
  readonly callerApplicableMinimumYears: number;
  readonly callerApplicableMaximumYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "observedLifeExpectancyYears",
    label: "Observed life expectancy years",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumYears",
    label: "Caller applicable minimum years",
    kind: "number",
  },
  {
    id: "callerApplicableMaximumYears",
    label: "Caller applicable maximum years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.observedLifeExpectancyYears, "lifeexpectancy");
  if (input.callerApplicableMaximumYears <= input.callerApplicableMinimumYears)
    simpleError("goalposts", "Positive goalpost span.");
  return {
    conditionalHealthIndex:
      (input.observedLifeExpectancyYears - input.callerApplicableMinimumYears) /
      (input.callerApplicableMaximumYears - input.callerApplicableMinimumYears),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedLifeExpectancyYears: 70,
    callerApplicableMinimumYears: 20,
    callerApplicableMaximumYears: 85,
  },
  output: { result: { conditionalHealthIndex: 0.7692307692307693 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/health-index",
  title: "Health Index Calculator",
  description:
    "Linear health-index normalization with independently applicable edition goalposts and life-expectancy estimate; outside-goalpost values stay signed/unclipped, not diagnosis or verified published HDI.",
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
