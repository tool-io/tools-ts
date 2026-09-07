import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPinReverseV: readonly number[];
  readonly observedPinJunctionCapacitanceFarads: readonly number[];
  readonly observedIndependentParallelStrayFarads: number;
  readonly queryReverseV: number;
}>;
export type Output = Readonly<{
  readonly interpolatedPinJunctionFarads: number;
  readonly modeledTotalPinFarads: number;
  readonly localPinCapacitanceDerivativeFaradsVolt: number;
}>;
const inputFields = [
  {
    id: "observedPinReverseV",
    label: "Observed pin reverse v",
    kind: "numberList",
  },
  {
    id: "observedPinJunctionCapacitanceFarads",
    label: "Observed pin junction capacitance farads",
    kind: "numberList",
  },
  {
    id: "observedIndependentParallelStrayFarads",
    label: "Observed independent parallel stray farads",
    kind: "number",
  },
  { id: "queryReverseV", label: "Query reverse v", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPinReverseV.forEach((v) =>
    nonnegative(v, "observedPinReverseV"),
  );
  input.observedPinJunctionCapacitanceFarads.forEach((v) =>
    nonnegative(v, "observedPinJunctionCapacitanceFarads"),
  );
  nonnegative(
    input.observedIndependentParallelStrayFarads,
    "observedIndependentParallelStrayFarads",
  );
  nonnegative(input.queryReverseV, "queryReverseV");
  const fit = curve(
    input.observedPinReverseV,
    input.observedPinJunctionCapacitanceFarads,
    input.queryReverseV,
  );
  return {
    interpolatedPinJunctionFarads: fit.value,
    modeledTotalPinFarads:
      fit.value + input.observedIndependentParallelStrayFarads,
    localPinCapacitanceDerivativeFaradsVolt: fit.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPinReverseV: [0, 1, 2],
  observedPinJunctionCapacitanceFarads: [3, 2, 1],
  observedIndependentParallelStrayFarads: 0.5,
  queryReverseV: 1.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedPinJunctionFarads: 1.5,
  modeledTotalPinFarads: 2,
  localPinCapacitanceDerivativeFaradsVolt: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/pin-diode-capacitance-vs-voltage",
  title: "Semiconductor Pin Diode Capacitance Vs Voltage Calculator",
  description:
    "Read actual PIN diode bias/capacitance curve with independent package stray, distinct from ideal varactor grading equation; no extrapolation or bias recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedPinJunctionFarads",
      label: "Interpolated pin junction farads",
      kind: "number",
    },
    {
      id: "modeledTotalPinFarads",
      label: "Modeled total pin farads",
      kind: "number",
    },
    {
      id: "localPinCapacitanceDerivativeFaradsVolt",
      label: "Local pin capacitance derivative farads volt",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPinReverseV: value.observedPinReverseV as readonly number[],
      observedPinJunctionCapacitanceFarads:
        value.observedPinJunctionCapacitanceFarads as readonly number[],
      observedIndependentParallelStrayFarads:
        value.observedIndependentParallelStrayFarads as number,
      queryReverseV: value.queryReverseV as number,
    }),
});
export const run = tool.execute;
export default tool;
