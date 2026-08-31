import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  interpolateLog,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly calibratedFrequenciesHz: readonly number[];
  readonly observedResistanceOhms: readonly number[];
  readonly observedReactanceOhms: readonly number[];
  readonly queryFrequencyHz: number;
}>;
export type Output = Readonly<{
  readonly interpolatedResistanceOhms: number;
  readonly interpolatedReactanceOhms: number;
  readonly impedanceMagnitudeOhms: number;
  readonly impedancePhaseDegrees: number;
}>;
const inputFields = [
  {
    id: "calibratedFrequenciesHz",
    label: "Calibrated frequencies hz",
    kind: "numberList",
  },
  {
    id: "observedResistanceOhms",
    label: "Observed resistance ohms",
    kind: "numberList",
  },
  {
    id: "observedReactanceOhms",
    label: "Observed reactance ohms",
    kind: "numberList",
  },
  { id: "queryFrequencyHz", label: "Query frequency hz", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.calibratedFrequenciesHz.forEach((v) =>
    positive(v, "calibratedFrequenciesHz"),
  );
  positive(input.queryFrequencyHz, "queryFrequencyHz");
  input.observedResistanceOhms.forEach((v) =>
    nonnegative(v, "observedResistanceOhms"),
  );
  aligned(
    input.calibratedFrequenciesHz,
    input.observedResistanceOhms,
    "calibratedFrequenciesHz",
  );
  aligned(
    input.calibratedFrequenciesHz,
    input.observedReactanceOhms,
    "calibratedFrequenciesHz",
  );
  const r = interpolateLog(
      input.calibratedFrequenciesHz,
      input.observedResistanceOhms,
      input.queryFrequencyHz,
    ),
    x = interpolateLog(
      input.calibratedFrequenciesHz,
      input.observedReactanceOhms,
      input.queryFrequencyHz,
    );
  return {
    interpolatedResistanceOhms: r,
    interpolatedReactanceOhms: x,
    impedanceMagnitudeOhms: Math.hypot(r, x),
    impedancePhaseDegrees: (Math.atan2(x, r) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  calibratedFrequenciesHz: [100, 1000],
  observedResistanceOhms: [10, 20],
  observedReactanceOhms: [5, -5],
  queryFrequencyHz: 100,
} satisfies Input;
export const exampleOutput = {
  interpolatedResistanceOhms: 10,
  interpolatedReactanceOhms: 5,
  impedanceMagnitudeOhms: 11.180339887498949,
  impedancePhaseDegrees: 26.56505117707799,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/ferrite-core-impedance-at-frequency",
  title: "Ferrite Core Impedance At Frequency Calculator",
  description:
    "Read measured ferrite complex impedance curve in log-frequency including reactance sign through resonance; not constant RL choke magnitude or ferrite insertion loss, no DC bias extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedResistanceOhms",
      label: "Interpolated resistance ohms",
      kind: "number",
    },
    {
      id: "interpolatedReactanceOhms",
      label: "Interpolated reactance ohms",
      kind: "number",
    },
    {
      id: "impedanceMagnitudeOhms",
      label: "Impedance magnitude ohms",
      kind: "number",
    },
    {
      id: "impedancePhaseDegrees",
      label: "Impedance phase degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      calibratedFrequenciesHz:
        value.calibratedFrequenciesHz as readonly number[],
      observedResistanceOhms: value.observedResistanceOhms as readonly number[],
      observedReactanceOhms: value.observedReactanceOhms as readonly number[],
      queryFrequencyHz: value.queryFrequencyHz as number,
    }),
});
export const run = tool.execute;
export default tool;
