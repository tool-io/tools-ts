import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly radialAmplitude: number;
  readonly integerPetalFrequency: number;
}>;
export type Output = Readonly<{
  readonly distinctPetalCount: number;
  readonly onePetalArea: number;
  readonly totalDistinctPetalArea: number;
}>;
const inputFields = [
  { id: "radialAmplitude", label: "Radial amplitude", kind: "number" },
  {
    id: "integerPetalFrequency",
    label: "Integer petal frequency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.radialAmplitude, "radialAmplitude");
  const k = bounded(input.integerPetalFrequency, "frequency", 1, 1000000),
    petals = k % 2 ? k : 2 * k,
    one = (Math.PI * input.radialAmplitude ** 2) / (4 * k);
  return {
    distinctPetalCount: petals,
    onePetalArea: one,
    totalDistinctPetalArea: one * petals,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  radialAmplitude: 2,
  integerPetalFrequency: 3,
} satisfies Input;
export const exampleOutput = {
  distinctPetalCount: 3,
  onePetalArea: 1.0471975511965976,
  totalDistinctPetalArea: 3.141592653589793,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/rose-area",
  title: "Rose Area Calculator",
  description:
    "Compute distinct rose petals for r=a cos(kθ), integer k; odd k repeats the curve over 2π, so repeated traces are not counted as extra area.",
  inputs: inputFields,
  outputs: [
    { id: "distinctPetalCount", label: "Distinct petal count", kind: "number" },
    { id: "onePetalArea", label: "One petal area", kind: "number" },
    {
      id: "totalDistinctPetalArea",
      label: "Total distinct petal area",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      radialAmplitude: value.radialAmplitude as number,
      integerPetalFrequency: value.integerPetalFrequency as number,
    }),
});
export const run = tool.execute;
export default tool;
