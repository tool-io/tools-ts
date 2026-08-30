import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly methylationDistance: number;
  readonly clonalThreshold: number;
  readonly relatedThreshold: number;
}>;
export type Output = Readonly<{
  readonly clonalMargin: number;
  readonly relationship: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.clonalThreshold > input.relatedThreshold)
    simpleError(
      "clonalThreshold",
      "Thresholds must be ordered.",
      "invalid_thresholds",
    );
  return {
    clonalMargin: input.clonalThreshold - input.methylationDistance,
    relationship:
      input.methylationDistance <= input.clonalThreshold
        ? "clonal"
        : input.methylationDistance <= input.relatedThreshold
          ? "related"
          : "distant",
  };
};

export const exampleInput = {
  methylationDistance: 0.1,
  clonalThreshold: 0.2,
  relatedThreshold: 0.5,
} satisfies Input;
export const exampleOutput = {
  clonalMargin: 0.1,
  relationship: "clonal",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      methylationDistance: input.methylationDistance as number,
      clonalThreshold: input.clonalThreshold as number,
      relatedThreshold: input.relatedThreshold as number,
    }),
  description: "Classify methylation-derived clonal distance.",
  id: "epigenetics/clonal-distance-classifier",
  inputs: [
    {
      id: "methylationDistance",
      label: "Methylation distance",
      kind: "number",
      minimum: 0,
    },
    {
      id: "clonalThreshold",
      label: "Clonal threshold",
      kind: "number",
      minimum: 0,
    },
    {
      id: "relatedThreshold",
      label: "Related threshold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "clonalMargin", label: "Clonal threshold margin", kind: "number" },
    {
      id: "relationship",
      label: "Relationship",
      kind: "string",
      enum: ["clonal", "related", "distant"],
    },
  ],
  title: "Clonal Distance Classifier",
});

export const run = tool.execute;
export default tool;
