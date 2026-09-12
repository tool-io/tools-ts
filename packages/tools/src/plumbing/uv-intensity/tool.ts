import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredUvEnergyMilliJoulesPerSquareCm: number;
  readonly actualExposureSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredUvEnergyMilliJoulesPerSquareCm",
    label: "Actual measured uv energy milli joules per square cm",
    kind: "number",
  },
  {
    id: "actualExposureSeconds",
    label: "Actual exposure seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMeasuredUvEnergyMilliJoulesPerSquareCm,
    "actualMeasuredUvEnergyMilliJoulesPerSquareCm",
  );
  positive(input.actualExposureSeconds, "actualExposureSeconds");
  return {
    value:
      input.actualMeasuredUvEnergyMilliJoulesPerSquareCm /
      input.actualExposureSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredUvEnergyMilliJoulesPerSquareCm: 10,
    actualExposureSeconds: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/uv-intensity",
  title: "Plumbing Uv Intensity Calculator",
  description:
    "Actual UV radiantfluence/exposure time meanmW/cm\u00b2, no inferfluencefromlampwatts or pathogen in activation/pot ability. Actual independently matched units, regime, material/equipment and governing references; not a hydraulic code, safe pressure, water pot ability or operational approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
