import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredCleftPixels: number;
  readonly callerMatchedNanometersPerPixel: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredCleftPixels",
    label: "Actual measured cleft pixels",
    kind: "number",
  },
  {
    id: "callerMatchedNanometersPerPixel",
    label: "Caller matched nanometers per pixel",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualMeasuredCleftPixels, "actualMeasuredCleftPixels");
  positive(
    input.callerMatchedNanometersPerPixel,
    "callerMatchedNanometersPerPixel",
  );
  return {
    value:
      input.actualMeasuredCleftPixels * input.callerMatchedNanometersPerPixel,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualMeasuredCleftPixels: 10, callerMatchedNanometersPerPixel: 2 },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/synaptic-cleft-width",
  title: "Synaptic Cleft Width Calculator",
  description:
    "Actual synaptic cleft image span\u00d7independently matched pixel calibration, not infer compartment/safe morphology from microscope label. Actual independently matched observations/units and protocol, not diagnosis, causal mechanism, clinical decision or validated individual prediction.",
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
