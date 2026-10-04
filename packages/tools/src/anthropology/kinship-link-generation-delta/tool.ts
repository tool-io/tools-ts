import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceGeneration: number;
  readonly targetGeneration: number;
};
export type Output = {
  readonly generationDelta: number;
  readonly direction: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceGeneration: { type: "integer", minimum: -10000, maximum: 10000 },
    targetGeneration: { type: "integer", minimum: -10000, maximum: 10000 },
  },
  required: ["sourceGeneration", "targetGeneration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generationDelta: { type: "integer" },
    direction: { type: "string", maxLength: 8192 },
  },
  required: ["generationDelta", "direction"],
} as const;
/** Describe a recorded kinship link using generation indices that increase toward descendants; no relationship is inferred from names. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceGeneration, targetGeneration } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(sourceGeneration) &&
        sourceGeneration >= -10000 &&
        sourceGeneration <= 10000,
      "sourceGeneration",
    ),
      sourceGeneration);
    (H.domain(
      Number.isSafeInteger(targetGeneration) &&
        targetGeneration >= -10000 &&
        targetGeneration <= 10000,
      "targetGeneration",
    ),
      targetGeneration);
    return {
      generationDelta: targetGeneration - sourceGeneration,
      direction:
        targetGeneration > sourceGeneration
          ? "descending"
          : targetGeneration < sourceGeneration
            ? "ascending"
            : "same-generation",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceGeneration: 2, targetGeneration: 4 },
  output: { generationDelta: 2, direction: "descending" },
} satisfies ToolExample<Input, Output>;
export const kinshipLinkGenerationDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/kinship-link-generation-delta",
    title: "Kinship Link Generation Delta Tool",
    description:
      "Describe a recorded kinship link using generation indices that increase toward descendants; no relationship is inferred from names.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceGeneration: { type: "integer", minimum: -10000, maximum: 10000 },
        targetGeneration: { type: "integer", minimum: -10000, maximum: 10000 },
      },
      required: ["sourceGeneration", "targetGeneration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generationDelta: { type: "integer" },
        direction: { type: "string", maxLength: 8192 },
      },
      required: ["generationDelta", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "sourceGeneration",
          label: "Source Generation",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetGeneration",
          label: "Target Generation",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "generationDelta",
          label: "Generation Delta",
          valueType: { type: "integer" },
        },
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = kinshipLinkGenerationDeltaTool.execute;
export default kinshipLinkGenerationDeltaTool;
