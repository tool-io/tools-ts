import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly modelId: string;
  readonly worldId: string;
  readonly propositionId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    modelId: { type: "string", maxLength: 8192, minLength: 1 },
    worldId: { type: "string", maxLength: 8192, minLength: 1 },
    propositionId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["modelId", "worldId", "propositionId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly identified proposition/world pair by its epistemic model without evaluating possibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { modelId, worldId, propositionId } = request;
  const compute = (): Output => {
    H.domain(modelId.length > 0, "modelId");
    H.domain(worldId.length > 0, "worldId");
    H.domain(propositionId.length > 0, "propositionId");
    return { token: JSON.stringify([modelId, worldId, propositionId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { modelId: "M1", worldId: "W2", propositionId: "P3" },
  output: { token: '["M1","W2","P3"]' },
} satisfies ToolExample<Input, Output>;
export const epistemicPossibilityWorldTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["epistemology", "philosophy"],
      keywords: ["epistemology", "philosophy"],
    },
    id: "epistemology/epistemic-possibility-world-tag",
    title: "Epistemic Possibility World Tag",
    description:
      "Qualify an explicitly identified proposition/world pair by its epistemic model without evaluating possibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        modelId: { type: "string", maxLength: 8192, minLength: 1 },
        worldId: { type: "string", maxLength: 8192, minLength: 1 },
        propositionId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["modelId", "worldId", "propositionId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "modelId",
          label: "Model Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "worldId",
          label: "World Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "propositionId",
          label: "Proposition Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = epistemicPossibilityWorldTagTool.execute;
export default epistemicPossibilityWorldTagTool;
