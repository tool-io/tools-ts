import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  curve,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPinBiasAmps: readonly number[];
  readonly observedSmallSignalResistanceOhm: readonly number[];
  readonly queryBiasAmps: number;
  readonly observedPackageSeriesOhm: number;
}>;
export type Output = Readonly<{
  readonly interpolatedIntrinsicPinOhm: number;
  readonly totalPinSeriesOhm: number;
  readonly localPinResistanceDerivativeOhmAmp: number;
}>;
const inputFields = [
  {
    id: "observedPinBiasAmps",
    label: "Observed pin bias amps",
    kind: "numberList",
  },
  {
    id: "observedSmallSignalResistanceOhm",
    label: "Observed small signal resistance ohm",
    kind: "numberList",
  },
  { id: "queryBiasAmps", label: "Query bias amps", kind: "number" },
  {
    id: "observedPackageSeriesOhm",
    label: "Observed package series ohm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPinBiasAmps.forEach((v) => positive(v, "observedPinBiasAmps"));
  input.observedSmallSignalResistanceOhm.forEach((v) =>
    positive(v, "observedSmallSignalResistanceOhm"),
  );
  positive(input.queryBiasAmps, "queryBiasAmps");
  nonnegative(input.observedPackageSeriesOhm, "observedPackageSeriesOhm");
  const fit = curve(
    input.observedPinBiasAmps,
    input.observedSmallSignalResistanceOhm,
    input.queryBiasAmps,
  );
  return {
    interpolatedIntrinsicPinOhm: fit.value,
    totalPinSeriesOhm: fit.value + input.observedPackageSeriesOhm,
    localPinResistanceDerivativeOhmAmp: fit.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPinBiasAmps: [1, 2, 4],
  observedSmallSignalResistanceOhm: [4, 2, 1],
  queryBiasAmps: 3,
  observedPackageSeriesOhm: 0.5,
} satisfies Input;
export const exampleOutput = {
  interpolatedIntrinsicPinOhm: 1.5,
  totalPinSeriesOhm: 2,
  localPinResistanceDerivativeOhmAmp: -0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/pin-diode-resistance-vs-current",
  title: "Semiconductor Pin Diode Resistance Vs Current Calculator",
  description:
    "Read independently observed same-frequency PIN intrinsic resistance versus bias plus measured package series resistance; no constant carrier lifetime assumption or RF design guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedIntrinsicPinOhm",
      label: "Interpolated intrinsic pin ohm",
      kind: "number",
    },
    { id: "totalPinSeriesOhm", label: "Total pin series ohm", kind: "number" },
    {
      id: "localPinResistanceDerivativeOhmAmp",
      label: "Local pin resistance derivative ohm amp",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPinBiasAmps: value.observedPinBiasAmps as readonly number[],
      observedSmallSignalResistanceOhm:
        value.observedSmallSignalResistanceOhm as readonly number[],
      queryBiasAmps: value.queryBiasAmps as number,
      observedPackageSeriesOhm: value.observedPackageSeriesOhm as number,
    }),
});
export const run = tool.execute;
export default tool;
