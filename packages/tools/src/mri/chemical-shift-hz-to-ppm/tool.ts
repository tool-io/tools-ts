import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualSignedChemicalShiftHz: number;
  readonly actualReferenceResonanceHz: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSignedChemicalShiftHz",
    label: "Actual signed chemical shift hz",
    kind: "number",
  },
  {
    id: "actualReferenceResonanceHz",
    label: "Actual reference resonance hz",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualReferenceResonanceHz, "actualReferenceResonanceHz");
  return {
    value:
      (1e6 * input.actualSignedChemicalShiftHz) /
      input.actualReferenceResonanceHz,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSignedChemicalShiftHz: 20,
    actualReferenceResonanceHz: 10000000.0,
  },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/chemical-shift-hz-to-ppm",
  title: "Chemical Shift Hz to PPM Converter",
  description:
    "ActualsignedchemicalshiftHz/referenceHz\u00d71e6ppm, magnitudes matched reference, no assumed field/nucleus and sign retained.",
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
