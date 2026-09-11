import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredConcentration: number;
  readonly callerIndependentlyApplicableEndpointConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredConcentration",
    label: "Actual measured concentration",
    kind: "number",
  },
  {
    id: "callerIndependentlyApplicableEndpointConcentration",
    label: "Caller independently applicable endpoint concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMeasuredConcentration, "numerator");
  positive(
    input.callerIndependentlyApplicableEndpointConcentration,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.actualMeasuredConcentration) /
      input.callerIndependentlyApplicableEndpointConcentration,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredConcentration: 2,
    callerIndependentlyApplicableEndpointConcentration: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/toxicity-units",
  title: "Toxicity Units Calculator",
  description:
    "Actual single-substance toxic units normalized by independently applicable matching route/species/duration endpoint, not a universal toxic dose or harm probability. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
