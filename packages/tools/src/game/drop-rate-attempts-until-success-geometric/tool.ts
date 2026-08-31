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
  fraction,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly independentSuccessProbability: number;
  readonly callerTargetSuccessConfidence: number;
}>;
export type Output = Readonly<{
  readonly expectedAttemptsToFirstSuccess: number;
  readonly minimumAttemptsAtCallerConfidence: number;
  readonly attainedAtLeastOneSuccessProbability: number;
}>;
const inputFields = [
  {
    id: "independentSuccessProbability",
    label: "Independent success probability",
    kind: "number",
  },
  {
    id: "callerTargetSuccessConfidence",
    label: "Caller target success confidence",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(
    input.independentSuccessProbability,
    "independentSuccessProbability",
  );
  fraction(
    input.callerTargetSuccessConfidence,
    "callerTargetSuccessConfidence",
  );
  positive(input.independentSuccessProbability, "successProbability");
  if (
    input.callerTargetSuccessConfidence === 1 &&
    input.independentSuccessProbability < 1
  )
    simpleError(
      "confidence",
      "Certain success has no finite independent-trial attempt bound.",
    );
  const p = input.independentSuccessProbability,
    c = input.callerTargetSuccessConfidence,
    n =
      c === 0
        ? 0
        : p === 1
          ? 1
          : safeCeil(Math.log1p(-c) / Math.log1p(-p), "attempts");
  return {
    expectedAttemptsToFirstSuccess: 1 / p,
    minimumAttemptsAtCallerConfidence: n,
    attainedAtLeastOneSuccessProbability:
      n === 0 ? 0 : p === 1 ? 1 : -Math.expm1(n * Math.log1p(-p)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentSuccessProbability: 0.5,
  callerTargetSuccessConfidence: 0.75,
} satisfies Input;
export const exampleOutput = {
  expectedAttemptsToFirstSuccess: 2,
  minimumAttemptsAtCallerConfidence: 2,
  attainedAtLeastOneSuccessProbability: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/drop-rate-attempts-until-success-geometric",
  title: "Drop Rate Geometric Attempts To Success",
  description:
    "Compute independent constant-probability first-success expectation and finite confidence quantile, with stable tails and no promise that the expectation is a guarantee; no pity/dependence assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "expectedAttemptsToFirstSuccess",
      label: "Expected attempts to first success",
      kind: "number",
    },
    {
      id: "minimumAttemptsAtCallerConfidence",
      label: "Minimum attempts at caller confidence",
      kind: "number",
    },
    {
      id: "attainedAtLeastOneSuccessProbability",
      label: "Attained at least one success probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentSuccessProbability:
        value.independentSuccessProbability as number,
      callerTargetSuccessConfidence:
        value.callerTargetSuccessConfidence as number,
    }),
});
export const run = tool.execute;
export default tool;
