import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generation: number;
  readonly withinGeneration: number;
};
export type Output = {
  readonly heapIndex: number;
  readonly parentIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generation: { type: "integer", minimum: 0, maximum: 51 },
    withinGeneration: { type: "integer", minimum: 0 },
  },
  required: ["generation", "withinGeneration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    heapIndex: { type: "integer" },
    parentIndex: { type: "integer" },
  },
  required: ["heapIndex", "parentIndex"],
} as const;
/** Zero-based complete-binary-tree lineage indexing; -1 denotes no parent for the root. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generation, withinGeneration } = request;
  const compute = (): Output => {
    H.integer(generation, 0, 51);
    H.integer(withinGeneration, 0, 2 ** generation - 1);
    return {
      heapIndex: 2 ** generation - 1 + withinGeneration,
      parentIndex:
        generation === 0
          ? -1
          : Math.floor((2 ** generation - 2 + withinGeneration) / 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generation: 3, withinGeneration: 2 },
  output: { heapIndex: 9, parentIndex: 4 },
} satisfies ToolExample<Input, Output>;
export const cellLineageBinaryGenerationIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-biology/cell-lineage-binary-generation-index",
    title: "Cell Lineage Binary Generation Index Tool",
    description:
      "Zero-based complete-binary-tree lineage indexing; -1 denotes no parent for the root.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generation: { type: "integer", minimum: 0, maximum: 51 },
        withinGeneration: { type: "integer", minimum: 0 },
      },
      required: ["generation", "withinGeneration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        heapIndex: { type: "integer" },
        parentIndex: { type: "integer" },
      },
      required: ["heapIndex", "parentIndex"],
    },
    ports: {
      inputs: [
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
          id: "heapIndex",
          label: "Heap Index",
          valueType: { type: "integer" },
        },
        {
          id: "parentIndex",
          label: "Parent Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellLineageBinaryGenerationIndexTool.execute;
export default cellLineageBinaryGenerationIndexTool;
