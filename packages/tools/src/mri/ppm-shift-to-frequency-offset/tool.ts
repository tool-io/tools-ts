import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly chemicalShiftPpm: number;
  readonly referenceFrequencyMHz: number;
}>;
export type Output = Readonly<{
  readonly offsetHz: number;
}>;
const inputFields = [
  {
    id: "chemicalShiftPpm",
    label: "Chemical shift ppm",
    kind: "number",
    unit: "ppm",
  },
  {
    id: "referenceFrequencyMHz",
    label: "Reference frequency m hz",
    kind: "number",
    unit: "Hz",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceFrequencyMHz, "referenceFrequencyMHz");
  return { offsetHz: input.chemicalShiftPpm * input.referenceFrequencyMHz };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  chemicalShiftPpm: -3.5,
  referenceFrequencyMHz: 100,
} satisfies Input;
export const exampleOutput = { offsetHz: -350 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/ppm-shift-to-frequency-offset",
  title: "Chemical Shift PPM to Hz Converter",
  description:
    "Invert a signed chemical shift into a frequency offset using reference frequency in MHz; this is distinct from existing sample/reference frequency-to-ppm tools.",
  inputs: inputFields,
  outputs: [{ id: "offsetHz", label: "Offset hz", kind: "number", unit: "Hz" }],
  calculate: (value) =>
    calculate({
      chemicalShiftPpm: value.chemicalShiftPpm as number,
      referenceFrequencyMHz: value.referenceFrequencyMHz as number,
    }),
});
export const run = tool.execute;
export default tool;
