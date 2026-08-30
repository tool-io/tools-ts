import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly bloodT1Ms: number;
  readonly bloodNullDelayMs: number;
  readonly tissueT1Ms: number;
  readonly intervalBetweenInversionsMs: number;
}>;
export type Output = Readonly<{
  readonly freshBloodLongitudinalFraction: number;
  readonly residentTissueLongitudinalFraction: number;
}>;
const inputFields = [
  { id: "bloodT1Ms", label: "Blood t1 ms", kind: "number", unit: "ms" },
  {
    id: "bloodNullDelayMs",
    label: "Blood null delay ms",
    kind: "number",
    unit: "ms",
  },
  { id: "tissueT1Ms", label: "Tissue t1 ms", kind: "number", unit: "ms" },
  {
    id: "intervalBetweenInversionsMs",
    label: "Interval between inversions ms",
    kind: "number",
    unit: "ms",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.bloodT1Ms, "bloodT1Ms");
  positive(input.tissueT1Ms, "tissueT1Ms");
  nonnegative(input.bloodNullDelayMs, "bloodNullDelayMs");
  nonnegative(input.intervalBetweenInversionsMs, "intervalBetweenInversionsMs");
  return {
    freshBloodLongitudinalFraction:
      1 - 2 * Math.exp(-input.bloodNullDelayMs / input.bloodT1Ms),
    residentTissueLongitudinalFraction:
      1 -
      2 *
        (1 - Math.exp(-input.intervalBetweenInversionsMs / input.tissueT1Ms)) *
        Math.exp(-input.bloodNullDelayMs / input.tissueT1Ms),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bloodT1Ms: 1000,
  bloodNullDelayMs: 693.1471805599452,
  tissueT1Ms: 1000,
  intervalBetweenInversionsMs: 100,
} satisfies Input;
export const exampleOutput = {
  freshBloodLongitudinalFraction: 0,
  residentTissueLongitudinalFraction: 0.9048374180359595,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/double-inversion-blood-recovery",
  title: "Double Inversion Black Blood TI",
  description:
    "Model ideal fresh-blood single-inversion nulling and resident-tissue recovery after nonselective then selective inversion; flow replacement, TR history and imperfect inversion are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "freshBloodLongitudinalFraction",
      label: "Fresh blood longitudinal fraction",
      kind: "number",
    },
    {
      id: "residentTissueLongitudinalFraction",
      label: "Resident tissue longitudinal fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      bloodT1Ms: value.bloodT1Ms as number,
      bloodNullDelayMs: value.bloodNullDelayMs as number,
      tissueT1Ms: value.tissueT1Ms as number,
      intervalBetweenInversionsMs: value.intervalBetweenInversionsMs as number,
    }),
});
export const run = tool.execute;
export default tool;
