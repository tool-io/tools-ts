import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIntervalConcentrations: readonly number[];
  readonly actualIntervalMinutes: readonly number[];
  readonly callerIndependentlyValidatedTenBergeExponent: number;
  readonly callerComparedConcentration: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIntervalConcentrations",
    label: "Actual interval concentrations",
    kind: "numberList",
  },
  {
    id: "actualIntervalMinutes",
    label: "Actual interval minutes",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyValidatedTenBergeExponent",
    label: "Caller independently validated ten berge exponent",
    kind: "number",
  },
  {
    id: "callerComparedConcentration",
    label: "Caller compared concentration",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.actualIntervalConcentrations,
    input.actualIntervalMinutes,
    "intervals",
  );
  input.actualIntervalConcentrations.forEach((v) =>
    nonnegative(v, "concentration"),
  );
  input.actualIntervalMinutes.forEach((v) => positive(v, "minutes"));
  positive(input.callerIndependentlyValidatedTenBergeExponent, "n");
  positive(input.callerComparedConcentration, "comparison-concentration");
  const t = sum(
    input.actualIntervalConcentrations.map(
      (v, i) =>
        v ** input.callerIndependentlyValidatedTenBergeExponent *
        input.actualIntervalMinutes[i],
    ),
  );
  return {
    conditionalPowerWeightedConcentrationTime: t,
    conditionalEquivalentMinutesAtCallerConcentration:
      t /
      input.callerComparedConcentration **
        input.callerIndependentlyValidatedTenBergeExponent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIntervalConcentrations: [1, 2],
    actualIntervalMinutes: [2, 3],
    callerIndependentlyValidatedTenBergeExponent: 2,
    callerComparedConcentration: 2,
  },
  output: {
    result: {
      conditionalPowerWeightedConcentrationTime: 14,
      conditionalEquivalentMinutesAtCallerConcentration: 3.5,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/ten-berge",
  title: "Ten Berge Scaling Calculator",
  description:
    "Declared tenBerge\u2211C^n\u0394tand equivalent time under independently validated exponent, n>0. Not existing n=1Haberintegration, universal exponent, iso-effect certainty or safe exposure duration.",
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
