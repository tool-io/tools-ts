import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  finite,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly initialPrestressPa: number;
  readonly callerSequentialStageLossFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly remainingPrestressByStagePa: readonly number[];
  readonly totalSequentialPrestressLossPa: number;
}>;
const inputFields = [
  { id: "initialPrestressPa", label: "Initial prestress pa", kind: "number" },
  {
    id: "callerSequentialStageLossFractions",
    label: "Caller sequential stage loss fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.initialPrestressPa, "initialPrestressPa");
  input.callerSequentialStageLossFractions.forEach((v) =>
    fraction(v, "callerSequentialStageLossFractions"),
  );
  let stress = input.initialPrestressPa;
  const stages = input.callerSequentialStageLossFractions.map((v) => {
    stress = finite(stress * (1 - v));
    return stress;
  });
  return {
    remainingPrestressByStagePa: stages,
    totalSequentialPrestressLossPa: input.initialPrestressPa - stress,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialPrestressPa: 100,
  callerSequentialStageLossFractions: [0.1, 0.2],
} satisfies Input;
export const exampleOutput = {
  remainingPrestressByStagePa: [90, 72],
  totalSequentialPrestressLossPa: 28,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/prestress-losses-total",
  title: "Total Prestress Losses Calculator",
  description:
    "Compose explicitly sequential prestress loss fractions on each remaining stage stress, not double-counted independent additive losses. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "remainingPrestressByStagePa",
      label: "Remaining prestress by stage pa",
      kind: "numberList",
    },
    {
      id: "totalSequentialPrestressLossPa",
      label: "Total sequential prestress loss pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialPrestressPa: value.initialPrestressPa as number,
      callerSequentialStageLossFractions:
        value.callerSequentialStageLossFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
