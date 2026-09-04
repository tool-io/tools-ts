import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  integral,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedFireTimesSeconds: readonly number[];
  readonly observedFireGasTemperaturesC: readonly number[];
  readonly callerThermalDatumC: number;
}>;
export type Output = Readonly<{
  readonly signedFireTemperatureTimeExposureCSeconds: number;
}>;
const inputFields = [
  {
    id: "observedFireTimesSeconds",
    label: "Observed fire times seconds",
    kind: "numberList",
  },
  {
    id: "observedFireGasTemperaturesC",
    label: "Observed fire gas temperatures c",
    kind: "numberList",
  },
  {
    id: "callerThermalDatumC",
    label: "Caller thermal datum c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedFireTimesSeconds.forEach((v) =>
    nonnegative(v, "observedFireTimesSeconds"),
  );
  return {
    signedFireTemperatureTimeExposureCSeconds: integral(
      input.observedFireTimesSeconds,
      input.observedFireGasTemperaturesC.map(
        (v) => v - input.callerThermalDatumC,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFireTimesSeconds: [0, 1, 3],
  observedFireGasTemperaturesC: [20, 30, 30],
  callerThermalDatumC: 20,
} satisfies Input;
export const exampleOutput = {
  signedFireTemperatureTimeExposureCSeconds: 25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/fire-severity-time-temperature",
  title: "Fire Time-Temperature Severity Calculator",
  description:
    "Integrate actual signed gas-temperature excess exposure, not standard-fire rating or energy without heat transfer. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedFireTemperatureTimeExposureCSeconds",
      label: "Signed fire temperature time exposure c seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFireTimesSeconds:
        value.observedFireTimesSeconds as readonly number[],
      observedFireGasTemperaturesC:
        value.observedFireGasTemperaturesC as readonly number[],
      callerThermalDatumC: value.callerThermalDatumC as number,
    }),
});
export const run = tool.execute;
export default tool;
