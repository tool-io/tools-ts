import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAnnotatedEthosPathosLogosWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAnnotatedEthosPathosLogosWeights",
    label: "Independently annotated ethos pathos logos weights",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyAnnotatedEthosPathosLogosWeights.length !== 3)
    simpleError("appeals", "Exactly ethos, pathos, logos nonnegative weights.");
  input.independentlyAnnotatedEthosPathosLogosWeights.forEach((v) =>
    nonnegative(v, "weight"),
  );
  const t = positive(
    sum(input.independentlyAnnotatedEthosPathosLogosWeights),
    "totalweight",
  );
  return {
    normalizedAppealShares:
      input.independentlyAnnotatedEthosPathosLogosWeights.map((v) => v / t),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyAnnotatedEthosPathosLogosWeights: [2, 1, 1] },
  output: { result: { normalizedAppealShares: [0.5, 0.25, 0.25] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/ethos-pathos-logos-balance-checker",
  title: "Ethos Pathos Logos Balance Checker",
  description:
    "Normalize independently annotated appeal weights; no universal ideal balance or automatic intent detection.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
