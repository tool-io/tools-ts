import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyQualifiedMaternalToxicEndpointDose: number;
  readonly matchedDevelopmentalToxicEndpointDose: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyQualifiedMaternalToxicEndpointDose",
    label: "Independently qualified maternal toxic endpoint dose",
    kind: "number",
  },
  {
    id: "matchedDevelopmentalToxicEndpointDose",
    label: "Matched developmental toxic endpoint dose",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyQualifiedMaternalToxicEndpointDose,
    "numerator",
  );
  positive(input.matchedDevelopmentalToxicEndpointDose, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyQualifiedMaternalToxicEndpointDose) /
      input.matchedDevelopmentalToxicEndpointDose,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyQualifiedMaternalToxicEndpointDose: 2,
    matchedDevelopmentalToxicEndpointDose: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/developmental-toxicity-teratogenic-index",
  title: "Teratogenic Index Calculator",
  description:
    "Explicit teratogenic-index maternal/developmental endpoint dose ratio under independently compatible assay/species conventions, not a universal definition or human fetal-risk probability. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
