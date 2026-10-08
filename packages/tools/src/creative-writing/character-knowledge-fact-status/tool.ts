import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly characterFactId: string;
  readonly status: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    characterFactId: { type: "string", maxLength: 8192, minLength: 1 },
    status: {
      type: "string",
      maxLength: 8192,
      enum: ["knows", "believes", "unknown", "mistaken"],
    },
  },
  required: ["characterFactId", "status"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a caller-supplied character-fact knowledge status without deriving it from story events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { characterFactId, status } = request;
  const compute = (): Output => {
    H.domain(characterFactId.length > 0, "characterFactId");
    H.domain(
      ["knows", "believes", "unknown", "mistaken"].includes(status),
      "status",
    );
    return { label: characterFactId + " [" + status + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { characterFactId: "CF17", status: "believes" },
  output: { label: "CF17 [believes]" },
} satisfies ToolExample<Input, Output>;
export const characterKnowledgeFactStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/character-knowledge-fact-status",
    title: "Character Knowledge Fact Status",
    description:
      "Label a caller-supplied character-fact knowledge status without deriving it from story events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        characterFactId: { type: "string", maxLength: 8192, minLength: 1 },
        status: {
          type: "string",
          maxLength: 8192,
          enum: ["knows", "believes", "unknown", "mistaken"],
        },
      },
      required: ["characterFactId", "status"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "characterFactId",
          label: "Character Fact Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "status",
          label: "Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = characterKnowledgeFactStatusTool.execute;
export default characterKnowledgeFactStatusTool;
