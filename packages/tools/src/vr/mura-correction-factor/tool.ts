import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly callerActualTargetLuminance: number;
  readonly actualMeasuredPixelLuminance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerActualTargetLuminance",
    label: "Caller actual target luminance",
    kind: "number",
  },
  {
    id: "actualMeasuredPixelLuminance",
    label: "Actual measured pixel luminance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.callerActualTargetLuminance, "callerActualTargetLuminance");
  positive(input.actualMeasuredPixelLuminance, "actualMeasuredPixelLuminance");
  return {
    value:
      input.callerActualTargetLuminance / input.actualMeasuredPixelLuminance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { callerActualTargetLuminance: 4, actualMeasuredPixelLuminance: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/mura-correction-factor",
  title: "Mura Correction Factor Calculator",
  description:
    "Measured flat field multiplicative mura correction gain at actual positive pixel response, target external, not global gain or a full nonlinear calibration LUT/clip/safety guarantee.",
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
