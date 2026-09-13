import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualOpticallyMeasuredAccommodationDiopters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualOpticallyMeasuredAccommodationDiopters",
    label: "Actual optically measured accommodation diopters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualOpticallyMeasuredAccommodationDiopters,
    "actualOpticallyMeasuredAccommodationDiopters",
  );
  return { value: 1 / input.actualOpticallyMeasuredAccommodationDiopters };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualOpticallyMeasuredAccommodationDiopters: 0.5 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/accommodation-distance",
  title: "Accommodation Distance Calculator",
  description:
    "Positive branch virtual focus accommodation distance meters reciprocal independently measuredopticaldiopters, zero/infinite branch rejected. Not clinical accommodativeprediction.",
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
