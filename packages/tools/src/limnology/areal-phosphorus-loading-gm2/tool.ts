import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly externalSourcePhosphorusKg: readonly number[];
  readonly matchedIntervalDays: number;
  readonly lakeAreaM2: number;
}>;
export type Output = Readonly<{
  readonly observedIntervalArealPhosphorusLoadingGm2: number;
  readonly annualizedExternalArealLoadGm2Year: number;
}>;
const inputFields = [
  {
    id: "externalSourcePhosphorusKg",
    label: "External source phosphorus kg",
    kind: "numberList",
  },
  { id: "matchedIntervalDays", label: "Matched interval days", kind: "number" },
  { id: "lakeAreaM2", label: "Lake area m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.matchedIntervalDays, "matchedIntervalDays");
  positive(input.lakeAreaM2, "lakeAreaM2");
  input.externalSourcePhosphorusKg.forEach((v) =>
    nonnegative(v, "externalSourcePhosphorusKg"),
  );
  const load =
    (sum(input.externalSourcePhosphorusKg) * 1000) / input.lakeAreaM2;
  return {
    observedIntervalArealPhosphorusLoadingGm2: load,
    annualizedExternalArealLoadGm2Year:
      load * (365 / input.matchedIntervalDays),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  externalSourcePhosphorusKg: [10, 20],
  matchedIntervalDays: 365,
  lakeAreaM2: 1000,
} satisfies Input;
export const exampleOutput = {
  observedIntervalArealPhosphorusLoadingGm2: 30,
  annualizedExternalArealLoadGm2Year: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/areal-phosphorus-loading-gm2",
  title: "Areal Phosphorus Loading GM2 Calculator",
  description:
    "Normalize actual matched external-source phosphorus ledger to areal loading and explicit 365-day annualization; not loading-limit inversion or measured internal release.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedIntervalArealPhosphorusLoadingGm2",
      label: "Observed interval areal phosphorus loading gm2",
      kind: "number",
    },
    {
      id: "annualizedExternalArealLoadGm2Year",
      label: "Annualized external areal load gm2 year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      externalSourcePhosphorusKg:
        value.externalSourcePhosphorusKg as readonly number[],
      matchedIntervalDays: value.matchedIntervalDays as number,
      lakeAreaM2: value.lakeAreaM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
