import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly motherGenotype: string;
  readonly fatherGenotype: string;
}>;
export type Output = Readonly<{
  readonly rhPositiveOffspringProbability: number;
  readonly rhIncompatiblePregnancyProbability: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !["DD", "Dd", "dd"].includes(input.motherGenotype) ||
    !["DD", "Dd", "dd"].includes(input.fatherGenotype)
  )
    simpleError("motherGenotype", "Use DD, Dd or dd Rh-D genotypes.");
  let positiveChildren = 0;
  for (const m of input.motherGenotype)
    for (const f of input.fatherGenotype)
      if (m === "D" || f === "D") positiveChildren++;
  const rhPositiveOffspringProbability = positiveChildren / 4;
  return {
    rhPositiveOffspringProbability,
    rhIncompatiblePregnancyProbability:
      input.motherGenotype === "dd" ? rhPositiveOffspringProbability : 0,
  };
};
export const exampleInput = {
  motherGenotype: "dd",
  fatherGenotype: "Dd",
} satisfies Input;
export const exampleOutput = {
  rhPositiveOffspringProbability: 0.5,
  rhIncompatiblePregnancyProbability: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/rh-incompatibility-cross",
  title: "RH Incompatibility Cross",
  description:
    "Model Rh-D-positive offspring and maternal Rh incompatibility, not sensitization or disease probability.",
  inputs: [
    { id: "motherGenotype", label: "Mother genotype", kind: "string" },
    { id: "fatherGenotype", label: "Father genotype", kind: "string" },
  ],
  outputs: [
    {
      id: "rhPositiveOffspringProbability",
      label: "Rh positive offspring probability",
      kind: "number",
    },
    {
      id: "rhIncompatiblePregnancyProbability",
      label: "Rh incompatible pregnancy probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      motherGenotype: value.motherGenotype as string,
      fatherGenotype: value.fatherGenotype as string,
    }),
});
export const run = tool.execute;
export default tool;
