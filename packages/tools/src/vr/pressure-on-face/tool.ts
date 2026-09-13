import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualMeasuredFaceNormalForceNewtons: number;
  readonly actualMeasuredContactAreaSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualMeasuredFaceNormalForceNewtons",
    label: "Actual measured face normal force new tons",
    kind: "number",
  },
  {
    id: "actualMeasuredContactAreaSquareMeters",
    label: "Actual measured contact area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualMeasuredFaceNormalForceNewtons,
    "actualMeasuredFaceNormalForceNewtons",
  );
  positive(
    input.actualMeasuredContactAreaSquareMeters,
    "actualMeasuredContactAreaSquareMeters",
  );
  return {
    value:
      input.actualMeasuredFaceNormalForceNewtons /
      input.actualMeasuredContactAreaSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualMeasuredFaceNormalForceNewtons: 10,
    actualMeasuredContactAreaSquareMeters: 2,
  },
  output: { result: { value: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/pressure-on-face",
  title: "Pressure on Face Calculator",
  description:
    "ActualaveragefacenormalpressureN/m\u00b2, nonuniform local pea knot predicted; not biological safety or comfortable fit.",
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
