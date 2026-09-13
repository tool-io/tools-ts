import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualDecisionWeight: number;
  readonly actualObjectiveProbability: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDecisionWeight",
    label: "Actual decision weight",
    kind: "number",
  },
  {
    id: "actualObjectiveProbability",
    label: "Actual objective probability",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(input.actualDecisionWeight, "actualDecisionWeight");
  fraction(input.actualObjectiveProbability, "actualObjectiveProbability");
  if (
    input.actualDecisionWeight <= 0 ||
    input.actualDecisionWeight >= 1 ||
    input.actualObjectiveProbability <= 0 ||
    input.actualObjectiveProbability >= 1 ||
    Math.abs(Math.log(-Math.log(input.actualObjectiveProbability))) < 1e-12
  )
    simpleError("Prelec", "Interiorw,pandidentifiablep≠e^-1.");
  return {
    value:
      Math.log(-Math.log(input.actualDecisionWeight)) /
      Math.log(-Math.log(input.actualObjectiveProbability)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualDecisionWeight: 0.5, actualObjectiveProbability: 0.5 },
  output: { result: { value: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/prelec-probability-weighting-gamma",
  title: "Prelec Probability Weighting Gamma Estimator",
  description:
    "One parameter Prelecw(p)=exp[\u2212(\u2212lnp)^\u03b3]inverse at actual independently elicitedw, pinterior fractions, p\u2260exp(\u22121); not fit multiple parameters. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
