import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rankedGeneIds: readonly string[];
  readonly peakIndex: number;
  readonly enrichmentDirection: string;
}>;
export type Output = Readonly<{
  readonly leadingEdgeGeneIds: readonly string[];
  readonly leadingEdgeCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.rankedGeneIds.length === 0 ||
    input.peakIndex < 0 ||
    input.peakIndex >= input.rankedGeneIds.length ||
    !["positive", "negative"].includes(input.enrichmentDirection)
  )
    simpleError("peakIndex", "Ranked genes, peak and direction must be valid.");
  const leadingEdgeGeneIds =
    input.enrichmentDirection === "positive"
      ? input.rankedGeneIds.slice(0, input.peakIndex + 1)
      : input.rankedGeneIds.slice(input.peakIndex);
  return { leadingEdgeGeneIds, leadingEdgeCount: leadingEdgeGeneIds.length };
};

export const exampleInput = {
  rankedGeneIds: ["a", "b", "c", "d"],
  peakIndex: 2,
  enrichmentDirection: "positive",
} satisfies Input;
export const exampleOutput = {
  leadingEdgeGeneIds: ["a", "b", "c"],
  leadingEdgeCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/leading-edge-extractor",
  title: "Leading Edge Extractor",
  description:
    "Extract the leading-edge subset around a running enrichment peak.",
  inputs: [
    { id: "rankedGeneIds", kind: "stringList", label: "Ranked gene ids" },
    { id: "peakIndex", kind: "number", label: "Peak index" },
    {
      id: "enrichmentDirection",
      kind: "string",
      label: "Enrichment direction",
      enum: ["positive", "negative"],
    },
  ],
  outputs: [
    {
      id: "leadingEdgeGeneIds",
      kind: "stringList",
      label: "Leading edge gene ids",
    },
    { id: "leadingEdgeCount", kind: "number", label: "Leading edge count" },
  ],
  calculate: (value) =>
    calculate({
      rankedGeneIds: value.rankedGeneIds as readonly string[],
      peakIndex: value.peakIndex as number,
      enrichmentDirection: value.enrichmentDirection as string,
    }),
});
export const run = tool.execute;
export default tool;
