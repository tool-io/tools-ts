import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  interpolate,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly measuredTemperaturesC: readonly number[];
  readonly matchedEsrOhms: readonly number[];
  readonly queryTemperatureC: number;
  readonly referenceTemperatureC: number;
}>;
export type Output = Readonly<{
  readonly interpolatedEsrOhms: number;
  readonly esrToReferenceRatio: number;
}>;
const inputFields = [
  {
    id: "measuredTemperaturesC",
    label: "Measured temperatures c",
    kind: "numberList",
  },
  { id: "matchedEsrOhms", label: "Matched esr ohms", kind: "numberList" },
  { id: "queryTemperatureC", label: "Query temperature c", kind: "number" },
  {
    id: "referenceTemperatureC",
    label: "Reference temperature c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.matchedEsrOhms.forEach((v) => positive(v, "matchedEsrOhms"));
  aligned(
    input.measuredTemperaturesC,
    input.matchedEsrOhms,
    "measuredTemperaturesC",
  );
  const esr = interpolate(
      input.measuredTemperaturesC,
      input.matchedEsrOhms,
      input.queryTemperatureC,
    ),
    ref = interpolate(
      input.measuredTemperaturesC,
      input.matchedEsrOhms,
      input.referenceTemperatureC,
    );
  return { interpolatedEsrOhms: esr, esrToReferenceRatio: esr / ref };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredTemperaturesC: [0, 20, 40],
  matchedEsrOhms: [0.3, 0.2, 0.1],
  queryTemperatureC: 10,
  referenceTemperatureC: 20,
} satisfies Input;
export const exampleOutput = {
  interpolatedEsrOhms: 0.25,
  esrToReferenceRatio: 1.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/supercapacitor-esr-vs-temperature",
  title: "Supercapacitor Esr Vs Temperature Calculator",
  description:
    "Interpolate actual supercapacitor ESR-versus-temperature calibration at matched frequency/SOC and independent reference; not a generic linear tempco or universal cold ESR.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedEsrOhms",
      label: "Interpolated esr ohms",
      kind: "number",
    },
    {
      id: "esrToReferenceRatio",
      label: "Esr to reference ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredTemperaturesC: value.measuredTemperaturesC as readonly number[],
      matchedEsrOhms: value.matchedEsrOhms as readonly number[],
      queryTemperatureC: value.queryTemperatureC as number,
      referenceTemperatureC: value.referenceTemperatureC as number,
    }),
});
export const run = tool.execute;
export default tool;
