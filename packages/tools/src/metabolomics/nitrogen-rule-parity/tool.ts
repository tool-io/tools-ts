import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly nominalMass: number;
  readonly nitrogenAtoms: number;
}>;
export type Output = Readonly<{
  readonly oddMass: boolean;
  readonly oddNitrogen: boolean;
  readonly consistent: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.nominalMass) ||
    input.nominalMass < 0 ||
    !Number.isSafeInteger(input.nitrogenAtoms) ||
    input.nitrogenAtoms < 0
  )
    simpleError(
      "nominalMass",
      "Nonnegative integer nominal mass and nitrogen count required.",
    );
  const oddMass = input.nominalMass % 2 === 1,
    oddNitrogen = input.nitrogenAtoms % 2 === 1;
  return { oddMass, oddNitrogen, consistent: oddMass === oddNitrogen };
};
export const exampleInput = {
  nominalMass: 137,
  nitrogenAtoms: 1,
} satisfies Input;
export const exampleOutput = {
  oddMass: true,
  oddNitrogen: true,
  consistent: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nitrogen-rule-parity",
  title: "Nitrogen Rule Parity",
  description: "Check nitrogen-rule parity for an even-electron molecular ion.",
  inputs: [
    { id: "nominalMass", kind: "number", label: "Nominal mass" },
    { id: "nitrogenAtoms", kind: "number", label: "Nitrogen atoms" },
  ],
  outputs: [
    { id: "oddMass", kind: "boolean", label: "Odd mass" },
    { id: "oddNitrogen", kind: "boolean", label: "Odd nitrogen" },
    { id: "consistent", kind: "boolean", label: "Consistent" },
  ],
  calculate: (value) =>
    calculate({
      nominalMass: value.nominalMass as number,
      nitrogenAtoms: value.nitrogenAtoms as number,
    }),
});
export const run = tool.execute;
export default tool;
