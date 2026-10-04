import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly support: string; readonly medium: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    support: { type: "string", maxLength: 8192 },
    medium: { type: "string", maxLength: 8192 },
  },
  required: ["support", "medium"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Combine explicitly supplied medium and support display fields without classifying a work from an image. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { support, medium } = request;
  const compute = (): Output => {
    H.domain(support.trim().length > 0 && medium.trim().length > 0, "support");
    return { label: medium + " on " + support };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { support: "canvas", medium: "oil" },
  output: { label: "oil on canvas" },
} satisfies ToolExample<Input, Output>;
export const artworkSupportMediumFieldPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-support-medium-field-pair",
    title: "Artwork Support Medium Field Pair Tool",
    description:
      "Combine explicitly supplied medium and support display fields without classifying a work from an image.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        support: { type: "string", maxLength: 8192 },
        medium: { type: "string", maxLength: 8192 },
      },
      required: ["support", "medium"],
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
          id: "support",
          label: "Support",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "medium",
          label: "Medium",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artworkSupportMediumFieldPairTool.execute;
export default artworkSupportMediumFieldPairTool;
