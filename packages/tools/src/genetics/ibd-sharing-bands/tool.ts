import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly sharedSegmentsCm: readonly number[];
  readonly totalDiploidMapCm: number;
  readonly bandLabels: readonly string[];
  readonly minimumSharedCm: readonly number[];
}>;
export type Output = Readonly<{
  readonly totalSharedCm: number;
  readonly sharedMapFraction: number;
  readonly sharingBand: string;
}>;
export const calculate = (input: Input): Output => {
  input.sharedSegmentsCm.forEach((v) => nonnegative(v, "sharedSegmentsCm"));
  positive(input.totalDiploidMapCm, "totalDiploidMapCm");
  aligned(input.bandLabels, input.minimumSharedCm, "bandLabels");
  if (
    input.minimumSharedCm.some(
      (v, i) =>
        !Number.isFinite(v) ||
        v < 0 ||
        (i > 0 && v <= input.minimumSharedCm[i - 1]),
    )
  )
    simpleError(
      "minimumSharedCm",
      "Ordered distinct sharing cutoffs required.",
    );
  const totalSharedCm = input.sharedSegmentsCm.reduce((a, b) => a + b, 0);
  if (totalSharedCm > input.totalDiploidMapCm)
    simpleError(
      "sharedSegmentsCm",
      "Shared lengths exceed supplied map length.",
    );
  let index = -1;
  for (let i = 0; i < input.minimumSharedCm.length; i++)
    if (totalSharedCm >= input.minimumSharedCm[i]) index = i;
  return {
    totalSharedCm,
    sharedMapFraction: totalSharedCm / input.totalDiploidMapCm,
    sharingBand: index < 0 ? "below-bands" : input.bandLabels[index],
  };
};
export const exampleInput = {
  sharedSegmentsCm: [100, 150],
  totalDiploidMapCm: 500,
  bandLabels: ["low", "high"],
  minimumSharedCm: [0, 200],
} satisfies Input;
export const exampleOutput = {
  totalSharedCm: 250,
  sharedMapFraction: 0.5,
  sharingBand: "high",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/ibd-sharing-bands",
  title: "IBD Sharing Bands",
  description:
    "Classify measured IBD sharing by caller-defined bands without assigning a unique pedigree relationship.",
  inputs: [
    { id: "sharedSegmentsCm", label: "Shared segments cm", kind: "numberList" },
    {
      id: "totalDiploidMapCm",
      label: "Total diploid map cm",
      kind: "number",
      description:
        "Sum of both homologous genetic-map lengths. Segment lengths must count shared homologues consistently and exclude overlapping duplicates.",
    },
    { id: "bandLabels", label: "Band labels", kind: "stringList" },
    { id: "minimumSharedCm", label: "Minimum shared cm", kind: "numberList" },
  ],
  outputs: [
    { id: "totalSharedCm", label: "Total shared cm", kind: "number" },
    { id: "sharedMapFraction", label: "Shared map fraction", kind: "number" },
    { id: "sharingBand", label: "Sharing band", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      sharedSegmentsCm: value.sharedSegmentsCm as readonly number[],
      totalDiploidMapCm: value.totalDiploidMapCm as number,
      bandLabels: value.bandLabels as readonly string[],
      minimumSharedCm: value.minimumSharedCm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
