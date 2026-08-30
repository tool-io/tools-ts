import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly modification: string;
}>;
export type Output = Readonly<{
  readonly cascadeIndex: number;
  readonly nextStage: string;
}>;

export const calculate = (input: Input): Output => {
  const stages = ["5mC", "5hmC", "5fC", "5caC", "C"],
    cascadeIndex = stages.indexOf(input.modification);
  return {
    cascadeIndex,
    nextStage: cascadeIndex === 4 ? "none" : stages[cascadeIndex + 1],
  };
};

export const exampleInput = { modification: "5hmC" } satisfies Input;
export const exampleOutput = {
  cascadeIndex: 1,
  nextStage: "5fC",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      modification: input.modification as string,
    }),
  description: "Map a cytosine modification to its TET cascade stage.",
  id: "epigenetics/tet-cascade-stage",
  inputs: [
    {
      id: "modification",
      label: "Cytosine modification",
      kind: "string",
      enum: ["5mC", "5hmC", "5fC", "5caC", "C"],
    },
  ],
  outputs: [
    {
      id: "cascadeIndex",
      label: "Cascade index",
      kind: "integer",
      minimum: 0,
      maximum: 4,
    },
    { id: "nextStage", label: "Next stage", kind: "string" },
  ],
  title: "TET Cascade Stage",
});

export const run = tool.execute;
export default tool;
