import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  binary,
  unique,
  sum,
  mean,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerFamilyIds: readonly string[];
  readonly parentCompatibleIncomes: readonly number[];
  readonly childCompatibleIncomes: readonly number[];
  readonly pairedEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerFamilyIds", label: "Caller family ids", kind: "stringList" },
  {
    id: "parentCompatibleIncomes",
    label: "Parent compatible incomes",
    kind: "numberList",
  },
  {
    id: "childCompatibleIncomes",
    label: "Child compatible incomes",
    kind: "numberList",
  },
  {
    id: "pairedEvidenceKnownFlags",
    label: "Paired evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  unique(input.callerFamilyIds, "families");
  for (const v of [
    input.parentCompatibleIncomes,
    input.childCompatibleIncomes,
    input.pairedEvidenceKnownFlags,
  ])
    aligned(input.callerFamilyIds, v, "pairs");
  binary(input.pairedEvidenceKnownFlags, "known");
  [input.parentCompatibleIncomes, input.childCompatibleIncomes].forEach((v) =>
    v.forEach((x) => positive(x, "income")),
  );
  const x = input.parentCompatibleIncomes
      .filter((_, i) => input.pairedEvidenceKnownFlags[i])
      .map(Math.log),
    y = input.childCompatibleIncomes
      .filter((_, i) => input.pairedEvidenceKnownFlags[i])
      .map(Math.log);
  const mx = mean(x),
    my = mean(y),
    d = positive(sum(x.map((v) => (v - mx) ** 2)), "parentlogvariance");
  return {
    observedKnownLogIncomeElasticity:
      sum(x.map((v, i) => (v - mx) * (y[i] - my))) / d,
    includedFamilyIds: input.callerFamilyIds.filter(
      (_, i) => input.pairedEvidenceKnownFlags[i],
    ),
    unknownFamilyIds: input.callerFamilyIds.filter(
      (_, i) => !input.pairedEvidenceKnownFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerFamilyIds: ["a", "b", "c"],
    parentCompatibleIncomes: [1, 2, 4],
    childCompatibleIncomes: [2, 4, 8],
    pairedEvidenceKnownFlags: [1, 1, 1],
  },
  output: {
    result: {
      observedKnownLogIncomeElasticity: 1,
      includedFamilyIds: ["a", "b", "c"],
      unknownFamilyIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/social-mobility-intergenerational-elasticity",
  title: "Intergenerational Elasticity Calculator",
  description:
    "Observed matched-family log-income OLSelasticity with independently established known-pair evidence; preserve excluded family IDs. Actual compatible income/age/time definitions required; not causal mobility or predict a childs income.",
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
