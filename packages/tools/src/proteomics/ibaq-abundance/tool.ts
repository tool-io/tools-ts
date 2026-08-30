import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly summedPeptideIntensity: number;
  readonly theoreticalPeptideCount: number;
}>;
export type Output = Readonly<{
  readonly ibaq: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.summedPeptideIntensity < 0 ||
    input.theoreticalPeptideCount <= 0 ||
    !Number.isSafeInteger(input.theoreticalPeptideCount)
  )
    simpleError(
      "theoreticalPeptideCount",
      "Positive theoretical peptide count required.",
    );
  return { ibaq: input.summedPeptideIntensity / input.theoreticalPeptideCount };
};
export const exampleInput = {
  summedPeptideIntensity: 100,
  theoreticalPeptideCount: 5,
} satisfies Input;
export const exampleOutput = { ibaq: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/ibaq-abundance",
  title: "IBAQ Abundance",
  description:
    "Compute intensity-based absolute quantification per theoretical peptide.",
  inputs: [
    {
      id: "summedPeptideIntensity",
      label: "Summed peptide intensity",
      kind: "number",
    },
    {
      id: "theoreticalPeptideCount",
      label: "Theoretical peptide count",
      kind: "number",
    },
  ],
  outputs: [{ id: "ibaq", label: "Ibaq", kind: "number" }],
  calculate: (value) =>
    calculate({
      summedPeptideIntensity: value.summedPeptideIntensity as number,
      theoreticalPeptideCount: value.theoreticalPeptideCount as number,
    }),
});
export const run = tool.execute;
export default tool;
