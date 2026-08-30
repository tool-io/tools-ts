import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly exactMassDa: number;
  readonly exactRepeatMassDa: number;
  readonly nominalRepeatMassDa: number;
}>;
export type Output = Readonly<{
  readonly kendrickMass: number;
  readonly kendrickNominalMass: number;
  readonly kendrickDefect: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.exactMassDa <= 0 ||
    input.exactRepeatMassDa <= 0 ||
    input.nominalRepeatMassDa <= 0
  )
    simpleError(
      "exactRepeatMassDa",
      "Positive mass and repeat-unit basis required.",
    );
  const scaledMass =
      (input.exactMassDa * input.nominalRepeatMassDa) / input.exactRepeatMassDa,
    kendrickNominalMass = Math.round(scaledMass),
    kendrickMass =
      Math.abs(scaledMass - kendrickNominalMass) < 1e-12
        ? kendrickNominalMass
        : scaledMass;
  return {
    kendrickMass,
    kendrickNominalMass,
    kendrickDefect: kendrickNominalMass - kendrickMass,
  };
};
export const exampleInput = {
  exactMassDa: 28.0313,
  exactRepeatMassDa: 14.01565,
  nominalRepeatMassDa: 14,
} satisfies Input;
export const exampleOutput = {
  kendrickMass: 28,
  kendrickNominalMass: 28,
  kendrickDefect: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/kendrick-mass-defect",
  title: "Kendrick Mass Defect",
  description:
    "Convert exact mass to a caller-defined Kendrick repeat-unit basis.",
  inputs: [
    { id: "exactMassDa", kind: "number", label: "Exact mass da" },
    { id: "exactRepeatMassDa", kind: "number", label: "Exact repeat mass da" },
    {
      id: "nominalRepeatMassDa",
      kind: "number",
      label: "Nominal repeat mass da",
    },
  ],
  outputs: [
    { id: "kendrickMass", kind: "number", label: "Kendrick mass" },
    {
      id: "kendrickNominalMass",
      kind: "number",
      label: "Kendrick nominal mass",
    },
    { id: "kendrickDefect", kind: "number", label: "Kendrick defect" },
  ],
  calculate: (value) =>
    calculate({
      exactMassDa: value.exactMassDa as number,
      exactRepeatMassDa: value.exactRepeatMassDa as number,
      nominalRepeatMassDa: value.nominalRepeatMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
