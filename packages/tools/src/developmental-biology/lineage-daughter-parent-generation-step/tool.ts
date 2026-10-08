import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentGeneration: number;
  readonly daughterGeneration: number;
};
export type Output = {
  readonly generationStep: number;
  readonly immediateNextGeneration: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentGeneration: { type: "integer", minimum: 0 },
    daughterGeneration: { type: "integer", minimum: 0 },
  },
  required: ["parentGeneration", "daughterGeneration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generationStep: { type: "integer" },
    immediateNextGeneration: { type: "boolean" },
  },
  required: ["generationStep", "immediateNextGeneration"],
} as const;
/** Compare explicitly assigned parent/daughter lineage generation indices without inferring a biological division event. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentGeneration, daughterGeneration } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(parentGeneration) &&
        parentGeneration >= 0 &&
        parentGeneration <= Number.MAX_SAFE_INTEGER,
      "parentGeneration",
    ),
      parentGeneration);
    (H.domain(
      Number.isSafeInteger(daughterGeneration) &&
        daughterGeneration >= 0 &&
        daughterGeneration <= Number.MAX_SAFE_INTEGER,
      "daughterGeneration",
    ),
      daughterGeneration);
    return {
      generationStep: daughterGeneration - parentGeneration,
      immediateNextGeneration: daughterGeneration === parentGeneration + 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentGeneration: 3, daughterGeneration: 4 },
  output: { generationStep: 1, immediateNextGeneration: true },
} satisfies ToolExample<Input, Output>;
export const lineageDaughterParentGenerationStepTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["developmental-biology", "developmental biology", "biology"],
        keywords: ["developmental biology", "biology"],
      },
      id: "developmental-biology/lineage-daughter-parent-generation-step",
      title: "Lineage Daughter Parent Generation Step",
      description:
        "Compare explicitly assigned parent/daughter lineage generation indices without inferring a biological division event.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parentGeneration: { type: "integer", minimum: 0 },
          daughterGeneration: { type: "integer", minimum: 0 },
        },
        required: ["parentGeneration", "daughterGeneration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          generationStep: { type: "integer" },
          immediateNextGeneration: { type: "boolean" },
        },
        required: ["generationStep", "immediateNextGeneration"],
      },
      ports: {
        inputs: [
          {
            id: "parentGeneration",
            label: "Parent Generation",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "daughterGeneration",
            label: "Daughter Generation",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "generationStep",
            label: "Generation Step",
            valueType: { type: "integer" },
          },
          {
            id: "immediateNextGeneration",
            label: "Immediate Next Generation",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = lineageDaughterParentGenerationStepTool.execute;
export default lineageDaughterParentGenerationStepTool;
