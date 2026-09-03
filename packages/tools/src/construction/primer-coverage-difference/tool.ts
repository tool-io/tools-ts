import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedUnprimedTrialLiters: readonly number[];
  readonly observedPrimedTrialLiters: readonly number[];
  readonly matchedTrialAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly unprimedLitersPerM2: number;
  readonly primedLitersPerM2: number;
  readonly signedPrimedMinusUnprimedLitersPerM2: number;
}>;
const inputFields = [
  {
    id: "observedUnprimedTrialLiters",
    label: "Observed unprimed trial liters",
    kind: "numberList",
  },
  {
    id: "observedPrimedTrialLiters",
    label: "Observed primed trial liters",
    kind: "numberList",
  },
  {
    id: "matchedTrialAreasM2",
    label: "Matched trial areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedTrialAreasM2.forEach((v) => positive(v, "matchedTrialAreasM2"));
  input.observedUnprimedTrialLiters.forEach((v) =>
    nonnegative(v, "observedUnprimedTrialLiters"),
  );
  input.observedPrimedTrialLiters.forEach((v) =>
    nonnegative(v, "observedPrimedTrialLiters"),
  );
  aligned(
    input.observedUnprimedTrialLiters,
    input.observedPrimedTrialLiters,
    "observedUnprimedTrialLiters",
  );
  aligned(
    input.observedUnprimedTrialLiters,
    input.matchedTrialAreasM2,
    "observedUnprimedTrialLiters",
  );
  const area = sum(input.matchedTrialAreasM2),
    unprimed = sum(input.observedUnprimedTrialLiters) / area,
    primed = sum(input.observedPrimedTrialLiters) / area;
  return {
    unprimedLitersPerM2: unprimed,
    primedLitersPerM2: primed,
    signedPrimedMinusUnprimedLitersPerM2: primed - unprimed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUnprimedTrialLiters: [2, 4],
  observedPrimedTrialLiters: [1, 2],
  matchedTrialAreasM2: [10, 20],
} satisfies Input;
export const exampleOutput = {
  unprimedLitersPerM2: 0.2,
  primedLitersPerM2: 0.1,
  signedPrimedMinusUnprimedLitersPerM2: -0.1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "construction/primer-coverage-difference",
  title: "Primer Coverage Difference Calculator",
  description:
    "Actual matched primed/unprimed coating trials pooled by area, signed usage difference, no primer efficacy causality or manufacturer table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "unprimedLitersPerM2",
      label: "Unprimed liters per m2",
      kind: "number",
    },
    { id: "primedLitersPerM2", label: "Primed liters per m2", kind: "number" },
    {
      id: "signedPrimedMinusUnprimedLitersPerM2",
      label: "Signed primed minus unprimed liters per m2",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUnprimedTrialLiters:
        value.observedUnprimedTrialLiters as readonly number[],
      observedPrimedTrialLiters:
        value.observedPrimedTrialLiters as readonly number[],
      matchedTrialAreasM2: value.matchedTrialAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
