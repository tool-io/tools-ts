import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly phonemeWording: string;
  readonly position: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    phonemeWording: { type: "string", maxLength: 8192, minLength: 1 },
    position: {
      type: "string",
      maxLength: 8192,
      enum: ["initial", "medial", "final", "other", "unspecified"],
    },
  },
  required: ["itemId", "phonemeWording", "position"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Tag an explicitly identified speech item by supplied phoneme and word-position wording without analysis of articulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, phonemeWording, position } = request;
  const compute = (): Output => {
    H.domain(itemId.length > 0 && phonemeWording.length > 0, "itemId");
    H.domain(
      ["initial", "medial", "final", "other", "unspecified"].includes(position),
      "position",
    );
    return { tag: JSON.stringify([itemId, phonemeWording, position]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemId: "W17", phonemeWording: "/k/", position: "initial" },
  output: { tag: '["W17","/k/","initial"]' },
} satisfies ToolExample<Input, Output>;
export const articulationWordPositionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/articulation-word-position-tag",
    title: "Articulation Word Position Tag",
    description:
      "Tag an explicitly identified speech item by supplied phoneme and word-position wording without analysis of articulation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        phonemeWording: { type: "string", maxLength: 8192, minLength: 1 },
        position: {
          type: "string",
          maxLength: 8192,
          enum: ["initial", "medial", "final", "other", "unspecified"],
        },
      },
      required: ["itemId", "phonemeWording", "position"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "phonemeWording",
          label: "Phoneme Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "position",
          label: "Position",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = articulationWordPositionTagTool.execute;
export default articulationWordPositionTagTool;
