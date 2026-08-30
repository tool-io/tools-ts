import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly fieldTesla: number;
  readonly gyromagneticHzPerTesla: number;
}>;
export type Output = Readonly<{
  readonly frequencyHz: number;
  readonly angularFrequencyRadiansPerSecond: number;
}>;
const inputFields = [
  { id: "fieldTesla", label: "Field tesla", kind: "number" },
  {
    id: "gyromagneticHzPerTesla",
    label: "Gyromagnetic hz per tesla",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fieldTesla, "fieldTesla");
  if (input.gyromagneticHzPerTesla === 0)
    simpleError(
      "gyromagneticHzPerTesla",
      "Nonzero signed nuclear gyromagnetic ratio required.",
    );
  const frequencyHz = input.fieldTesla * input.gyromagneticHzPerTesla;
  return {
    frequencyHz,
    angularFrequencyRadiansPerSecond: 2 * Math.PI * frequencyHz,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fieldTesla: 3,
  gyromagneticHzPerTesla: 42577478.92,
} satisfies Input;
export const exampleOutput = {
  frequencyHz: 127732436.76,
  angularFrequencyRadiansPerSecond: 802566569.9006777,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/signed-larmor-frequency",
  title: "Larmor Frequency",
  description:
    "Calculate signed nuclear Larmor frequency and angular frequency with caller-supplied γ in Hz/T, rather than embedded isotope tables.",
  inputs: inputFields,
  outputs: [
    { id: "frequencyHz", label: "Frequency hz", kind: "number", unit: "Hz" },
    {
      id: "angularFrequencyRadiansPerSecond",
      label: "Angular frequency radians per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      fieldTesla: value.fieldTesla as number,
      gyromagneticHzPerTesla: value.gyromagneticHzPerTesla as number,
    }),
});
export const run = tool.execute;
export default tool;
