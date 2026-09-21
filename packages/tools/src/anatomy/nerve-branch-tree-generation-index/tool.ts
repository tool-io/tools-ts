import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branching: number;
  readonly generation: number;
  readonly withinGeneration: number;
};
export type Output = {
  readonly levelSize: number;
  readonly levelStart: number;
  readonly index: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branching: { type: "integer", minimum: 2, maximum: 10 },
    generation: { type: "integer", minimum: 0, maximum: 12 },
    withinGeneration: { type: "integer", minimum: 0 },
  },
  required: ["branching", "generation", "withinGeneration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    levelSize: { type: "integer" },
    levelStart: { type: "integer" },
    index: { type: "integer" },
  },
  required: ["levelSize", "levelStart", "index"],
} as const;
/** Complete regular branching-tree indexing of a supplied anatomical model, not an inferred biological branching topology; resource bounds keep indices exactly representable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branching, generation, withinGeneration } = request;
  const compute = (): Output => {
    H.integer(branching, 2, 10);
    H.integer(generation, 0, 12);
    const levelSize = branching ** generation;
    H.integer(withinGeneration, 0, levelSize - 1);
    const levelStart = (levelSize - 1) / (branching - 1);
    return { levelSize, levelStart, index: levelStart + withinGeneration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branching: 3, generation: 2, withinGeneration: 4 },
  output: { levelSize: 9, levelStart: 4, index: 8 },
} satisfies ToolExample<Input, Output>;
export const nerveBranchTreeGenerationIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anatomy/nerve-branch-tree-generation-index",
    title: "Nerve Branch Tree Generation Index Tool",
    description:
      "Complete regular branching-tree indexing of a supplied anatomical model, not an inferred biological branching topology; resource bounds keep indices exactly representable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branching: { type: "integer", minimum: 2, maximum: 10 },
        generation: { type: "integer", minimum: 0, maximum: 12 },
        withinGeneration: { type: "integer", minimum: 0 },
      },
      required: ["branching", "generation", "withinGeneration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        levelSize: { type: "integer" },
        levelStart: { type: "integer" },
        index: { type: "integer" },
      },
      required: ["levelSize", "levelStart", "index"],
    },
    ports: {
      inputs: [
        {
          id: "branching",
          label: "Branching",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "generation",
          label: "Generation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "withinGeneration",
          label: "Within Generation",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "levelSize",
          label: "Level Size",
          valueType: { type: "integer" },
        },
        {
          id: "levelStart",
          label: "Level Start",
          valueType: { type: "integer" },
        },
        { id: "index", label: "Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = nerveBranchTreeGenerationIndexTool.execute;
export default nerveBranchTreeGenerationIndexTool;
