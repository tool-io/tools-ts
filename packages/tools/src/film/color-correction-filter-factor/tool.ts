import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredReferenceExposedSignal: number;
  readonly actualMeasuredFilteredExposedSignal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredReferenceExposedSignal",
    label: "Actual measured reference exposed signal",
    kind: "number",
  },
  {
    id: "actualMeasuredFilteredExposedSignal",
    label: "Actual measured filtered exposed signal",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualMeasuredReferenceExposedSignal,
    "actualMeasuredReferenceExposedSignal",
  );
  positive(
    input.actualMeasuredFilteredExposedSignal,
    "actualMeasuredFilteredExposedSignal",
  );
  return {
    value:
      input.actualMeasuredReferenceExposedSignal /
      input.actualMeasuredFilteredExposedSignal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredReferenceExposedSignal: 4,
    actualMeasuredFilteredExposedSignal: 2,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/color-correction-filter-factor",
  title: "Color Correction Filter Factor Calculator",
  description:
    "Measured color correction filter exposure facto run filtered/filtered matched same channel/illumination, not ND2^stops or nominal filter color factors.",
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
