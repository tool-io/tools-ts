import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedJunctionIds: readonly string[];
  readonly annotatedJunctionIds: readonly string[];
}>;
export type Output = Readonly<{
  readonly annotatedCount: number;
  readonly novelCount: number;
  readonly novelJunctionIds: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  if (input.observedJunctionIds.length === 0)
    simpleError("observedJunctionIds", "Observed junctions required.");
  const annotated = new Set(input.annotatedJunctionIds),
    novelJunctionIds = input.observedJunctionIds.filter(
      (v) => !annotated.has(v),
    );
  return {
    annotatedCount: input.observedJunctionIds.length - novelJunctionIds.length,
    novelCount: novelJunctionIds.length,
    novelJunctionIds,
  };
};

export const exampleInput = {
  observedJunctionIds: ["a", "b", "c"],
  annotatedJunctionIds: ["a", "c"],
} satisfies Input;
export const exampleOutput = {
  annotatedCount: 2,
  novelCount: 1,
  novelJunctionIds: ["b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/junction-annotation-tally",
  title: "Junction Annotation Tally",
  description: "Tally annotated versus novel observed splice junctions.",
  inputs: [
    {
      id: "observedJunctionIds",
      kind: "stringList",
      label: "Observed junction ids",
    },
    {
      id: "annotatedJunctionIds",
      kind: "stringList",
      label: "Annotated junction ids",
    },
  ],
  outputs: [
    { id: "annotatedCount", kind: "number", label: "Annotated count" },
    { id: "novelCount", kind: "number", label: "Novel count" },
    { id: "novelJunctionIds", kind: "stringList", label: "Novel junction ids" },
  ],
  calculate: (value) =>
    calculate({
      observedJunctionIds: value.observedJunctionIds as readonly string[],
      annotatedJunctionIds: value.annotatedJunctionIds as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
