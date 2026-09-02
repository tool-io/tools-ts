import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  curve,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedTitrationPh: readonly number[];
  readonly observedAlreadyAddedBaseMolPerKg: readonly number[];
  readonly queryPh: number;
}>;
export type Output = Readonly<{
  readonly observedLocalBufferMolKgPerPh: number;
}>;
const inputFields = [
  {
    id: "observedTitrationPh",
    label: "Observed titration ph",
    kind: "numberList",
  },
  {
    id: "observedAlreadyAddedBaseMolPerKg",
    label: "Observed already added base mol per kg",
    kind: "numberList",
  },
  { id: "queryPh", label: "Query ph", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const f = curve(
    input.observedTitrationPh,
    input.observedAlreadyAddedBaseMolPerKg,
    input.queryPh,
  );
  input.observedAlreadyAddedBaseMolPerKg.forEach((v) =>
    nonnegative(v, "already added base"),
  );
  return { observedLocalBufferMolKgPerPh: f.slope };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTitrationPh: [4, 5, 6],
  observedAlreadyAddedBaseMolPerKg: [0, 2, 5],
  queryPh: 5,
} satisfies Input;
export const exampleOutput = {
  observedLocalBufferMolKgPerPh: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/soil-ph-buffering",
  title: "Agriculture Soil Ph Buffering Calculator",
  description:
    "Actual soil titration local base-addition/pH secant, interior right neighbor/final left, no lime recommendation or invented soil buffer table. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLocalBufferMolKgPerPh",
      label: "Observed local buffer mol kg per ph",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTitrationPh: value.observedTitrationPh as readonly number[],
      observedAlreadyAddedBaseMolPerKg:
        value.observedAlreadyAddedBaseMolPerKg as readonly number[],
      queryPh: value.queryPh as number,
    }),
});
export const run = tool.execute;
export default tool;
