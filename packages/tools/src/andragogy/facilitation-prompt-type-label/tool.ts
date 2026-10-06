import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly promptId: string; readonly promptType: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    promptId: { type: "string", maxLength: 8192, minLength: 1 },
    promptType: {
      type: "string",
      maxLength: 8192,
      enum: [
        "question",
        "reflection",
        "example",
        "practice",
        "feedback",
        "other",
      ],
    },
  },
  required: ["promptId", "promptType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly assigned facilitation prompt type without inferring pedagogical effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { promptId, promptType } = request;
  const compute = (): Output => {
    H.domain(promptId.length > 0, "promptId");
    H.domain(
      [
        "question",
        "reflection",
        "example",
        "practice",
        "feedback",
        "other",
      ].includes(promptType),
      "promptType",
    );
    return { label: promptId + " [prompt type: " + promptType + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { promptId: "P17", promptType: "reflection" },
  output: { label: "P17 [prompt type: reflection]" },
} satisfies ToolExample<Input, Output>;
export const facilitationPromptTypeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/facilitation-prompt-type-label",
    title: "Facilitation Prompt Type Label",
    description:
      "Label an explicitly assigned facilitation prompt type without inferring pedagogical effectiveness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        promptId: { type: "string", maxLength: 8192, minLength: 1 },
        promptType: {
          type: "string",
          maxLength: 8192,
          enum: [
            "question",
            "reflection",
            "example",
            "practice",
            "feedback",
            "other",
          ],
        },
      },
      required: ["promptId", "promptType"],
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
          id: "promptId",
          label: "Prompt Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "promptType",
          label: "Prompt Type",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = facilitationPromptTypeLabelTool.execute;
export default facilitationPromptTypeLabelTool;
