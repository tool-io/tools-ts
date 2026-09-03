import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly callerBoxVolumeM3: number;
  readonly observedSourceKgSecond: number;
  readonly callerVentilationM3Second: number;
  readonly callerBackgroundKgM3: number;
  readonly initialBoxKgM3: number;
  readonly querySeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly wellMixedBoxConcentrationsKgM3: readonly number[];
}>;
const inputFields = [
  { id: "callerBoxVolumeM3", label: "Caller box volume m3", kind: "number" },
  {
    id: "observedSourceKgSecond",
    label: "Observed source kg second",
    kind: "number",
  },
  {
    id: "callerVentilationM3Second",
    label: "Caller ventilation m3 second",
    kind: "number",
  },
  {
    id: "callerBackgroundKgM3",
    label: "Caller background kg m3",
    kind: "number",
  },
  { id: "initialBoxKgM3", label: "Initial box kg m3", kind: "number" },
  { id: "querySeconds", label: "Query seconds", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBoxVolumeM3, "callerBoxVolumeM3");
  positive(input.callerVentilationM3Second, "callerVentilationM3Second");
  nonnegative(input.observedSourceKgSecond, "observedSourceKgSecond");
  nonnegative(input.callerBackgroundKgM3, "callerBackgroundKgM3");
  nonnegative(input.initialBoxKgM3, "initialBoxKgM3");
  input.querySeconds.forEach((v) => nonnegative(v, "querySeconds"));
  const equilibrium =
    input.callerBackgroundKgM3 +
    input.observedSourceKgSecond / input.callerVentilationM3Second;
  return {
    wellMixedBoxConcentrationsKgM3: input.querySeconds.map(
      (t) =>
        equilibrium +
        (input.initialBoxKgM3 - equilibrium) *
          Math.exp(
            (-input.callerVentilationM3Second * t) / input.callerBoxVolumeM3,
          ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBoxVolumeM3: 10,
  observedSourceKgSecond: 1,
  callerVentilationM3Second: 2,
  callerBackgroundKgM3: 0.1,
  initialBoxKgM3: 0.2,
  querySeconds: [0, 5],
} satisfies Input;
export const exampleOutput = {
  wellMixedBoxConcentrationsKgM3: [0.2, 0.45284822353142307],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/box-model-dispersion",
  title: "Box Model Dispersion Calculator",
  description:
    "Time-dependent constant-source/ventilation well-mixed box, initial condition explicit, no spatial Gaussian dispersion or pollutant safety. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "wellMixedBoxConcentrationsKgM3",
      label: "Well mixed box concentrations kg m3",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBoxVolumeM3: value.callerBoxVolumeM3 as number,
      observedSourceKgSecond: value.observedSourceKgSecond as number,
      callerVentilationM3Second: value.callerVentilationM3Second as number,
      callerBackgroundKgM3: value.callerBackgroundKgM3 as number,
      initialBoxKgM3: value.initialBoxKgM3 as number,
      querySeconds: value.querySeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
