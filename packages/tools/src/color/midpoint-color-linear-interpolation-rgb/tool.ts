import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, rgb3 } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly encodedRgbA: readonly number[];
  readonly encodedRgbB: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "encodedRgbA", label: "Encoded rgb a", kind: "numberList" },
  { id: "encodedRgbB", label: "Encoded rgb b", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  rgb3(i.encodedRgbA);
  rgb3(i.encodedRgbB);
  return {
    encodedRgbMidpoint: i.encodedRgbA.map((v, j) => (v + i.encodedRgbB[j]) / 2),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { encodedRgbA: [1, 0, 0], encodedRgbB: [0, 0, 1] },
  output: { result: { encodedRgbMidpoint: [0.5, 0, 0.5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/midpoint-color-linear-interpolation-rgb",
  title: "Midpoint Color Linear Interpolation RGB",
  description:
    "Component midpoint in declared encoded normalized RGB coordinates, not linear-light or perceptual interpolation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
