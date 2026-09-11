import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  finite,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyVerifiedSequentialTrophicTransferFactors: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyVerifiedSequentialTrophicTransferFactors",
    label: "Caller independently verified sequential trophic transfer factors",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.callerIndependentlyVerifiedSequentialTrophicTransferFactors.length)
    simpleError(
      "chain",
      "Actual nonempty independent sequential transfer factors.",
    );
  input.callerIndependentlyVerifiedSequentialTrophicTransferFactors.forEach(
    (v) => nonnegative(v, "transfer-factor"),
  );
  return {
    conditionalSequentialFoodChainMultiplier:
      input.callerIndependentlyVerifiedSequentialTrophicTransferFactors.reduce(
        (a, b) => finite(a * b),
        1,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyVerifiedSequentialTrophicTransferFactors: [2, 3],
  },
  output: { result: { conditionalSequentialFoodChainMultiplier: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/food-chain-multiplier",
  title: "Food Chain Multiplier Calculator",
  description:
    "Conditional product of independently verified ordered step-specific trophic transfer factors, not regression-derived TMF, lipid-normalized BMF, actual foodweb exposure or guaranteed magnification.",
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
