import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly exposureDoseMgPerKgDay: number;
  readonly referenceDoseMgPerKgDay: number;
}>;
export type Output = Readonly<{
  readonly hazardQuotient: number;
  readonly aboveUnitQuotient: boolean;
}>;
const inputFields = [
  {
    id: "exposureDoseMgPerKgDay",
    label: "Exposure dose mg per kg day",
    kind: "number",
  },
  {
    id: "referenceDoseMgPerKgDay",
    label: "Reference dose mg per kg day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.exposureDoseMgPerKgDay, "exposureDoseMgPerKgDay");
  positive(input.referenceDoseMgPerKgDay, "referenceDoseMgPerKgDay");
  const hazardQuotient =
    input.exposureDoseMgPerKgDay / input.referenceDoseMgPerKgDay;
  return { hazardQuotient, aboveUnitQuotient: hazardQuotient > 1 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  exposureDoseMgPerKgDay: 0.2,
  referenceDoseMgPerKgDay: 0.1,
} satisfies Input;
export const exampleOutput = {
  hazardQuotient: 2,
  aboveUnitQuotient: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/reference-dose-hazard-quotient",
  title: "Hazard Quotient",
  description:
    "Compare an exposure dose with a caller-supplied route/time-compatible reference dose; HQ is a screening ratio, not a probability of harm.",
  inputs: inputFields,
  outputs: [
    { id: "hazardQuotient", label: "Hazard quotient", kind: "number" },
    { id: "aboveUnitQuotient", label: "Above unit quotient", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      exposureDoseMgPerKgDay: value.exposureDoseMgPerKgDay as number,
      referenceDoseMgPerKgDay: value.referenceDoseMgPerKgDay as number,
    }),
});
export const run = tool.execute;
export default tool;
