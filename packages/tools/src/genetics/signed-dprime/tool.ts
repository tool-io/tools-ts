import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { fraction, positive } from "../shared.js";

export type Input = Readonly<{
  readonly firstAlleleFrequency: number;
  readonly secondAlleleFrequency: number;
  readonly jointHaplotypeFrequency: number;
}>;
export type Output = Readonly<{
  readonly linkageD: number;
  readonly dMaximum: number;
  readonly dprime: number;
}>;
export const calculate = (input: Input): Output => {
  const p = fraction(input.firstAlleleFrequency, "firstAlleleFrequency"),
    q = fraction(input.secondAlleleFrequency, "secondAlleleFrequency"),
    h = fraction(input.jointHaplotypeFrequency, "jointHaplotypeFrequency");
  if (h < Math.max(0, p + q - 1) || h > Math.min(p, q))
    simpleError(
      "jointHaplotypeFrequency",
      "Haplotype probability incompatible with allele marginals.",
    );
  const linkageD = h - p * q,
    dMaximum =
      linkageD >= 0
        ? Math.min(p * (1 - q), (1 - p) * q)
        : Math.min(p * q, (1 - p) * (1 - q));
  positive(dMaximum, "firstAlleleFrequency");
  return { linkageD, dMaximum, dprime: linkageD / dMaximum };
};
export const exampleInput = {
  firstAlleleFrequency: 0.5,
  secondAlleleFrequency: 0.5,
  jointHaplotypeFrequency: 0.4,
} satisfies Input;
export const exampleOutput = {
  linkageD: 0.15,
  dMaximum: 0.25,
  dprime: 0.6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/signed-dprime",
  title: "Signed Dprime",
  description:
    "Normalize signed linkage disequilibrium D by its sign-specific feasible maximum.",
  inputs: [
    {
      id: "firstAlleleFrequency",
      label: "First allele frequency",
      kind: "number",
    },
    {
      id: "secondAlleleFrequency",
      label: "Second allele frequency",
      kind: "number",
    },
    {
      id: "jointHaplotypeFrequency",
      label: "Joint haplotype frequency",
      kind: "number",
    },
  ],
  outputs: [
    { id: "linkageD", label: "Linkage d", kind: "number" },
    { id: "dMaximum", label: "D maximum", kind: "number" },
    { id: "dprime", label: "Dprime", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      firstAlleleFrequency: value.firstAlleleFrequency as number,
      secondAlleleFrequency: value.secondAlleleFrequency as number,
      jointHaplotypeFrequency: value.jointHaplotypeFrequency as number,
    }),
});
export const run = tool.execute;
export default tool;
