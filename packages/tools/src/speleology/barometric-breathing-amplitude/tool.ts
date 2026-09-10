import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualBarometricPressurePaSamples: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBarometricPressurePaSamples",
    label: "Actual barometric pressure pa samples",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualBarometricPressurePaSamples.length)
    simpleError("samples", "Actual pressure trace.");
  input.actualBarometricPressurePaSamples.forEach((v) =>
    positive(v, "pressure"),
  );
  return {
    observedBarometricPressurePeakToPeakPa:
      Math.max(...input.actualBarometricPressurePaSamples) -
      Math.min(...input.actualBarometricPressurePaSamples),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualBarometricPressurePaSamples: [100, 105, 98] },
  output: { result: { observedBarometricPressurePeakToPeakPa: 7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/barometric-breathing-amplitude",
  title: "Barometric Cave Breathing Amplitude Calculator",
  description:
    "Actual sampled barometric pressure range, not air-volume exchange from pressure alone or unobserved cave-breathing maximum.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
