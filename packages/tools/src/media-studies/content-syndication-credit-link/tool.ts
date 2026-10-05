import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemId: string;
  readonly originalPublisher: string;
  readonly sourceReference: string;
};
export type Output = { readonly credit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemId: { type: "string", maxLength: 8192 },
    originalPublisher: { type: "string", maxLength: 8192 },
    sourceReference: { type: "string", maxLength: 8192 },
  },
  required: ["itemId", "originalPublisher", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credit: { type: "string", maxLength: 8192 } },
  required: ["credit"],
} as const;
/** Render an explicitly asserted syndication source credit without verifying ownership or reuse rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemId, originalPublisher, sourceReference } = request;
  const compute = (): Output => {
    H.domain(
      itemId.length > 0 &&
        originalPublisher.length > 0 &&
        sourceReference.length > 0,
      "itemId",
    );
    return {
      credit:
        itemId +
        " — originally published by " +
        originalPublisher +
        "; " +
        sourceReference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    itemId: "N17",
    originalPublisher: "Publisher A",
    sourceReference: "ref-42",
  },
  output: { credit: "N17 — originally published by Publisher A; ref-42" },
} satisfies ToolExample<Input, Output>;
export const contentSyndicationCreditLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/content-syndication-credit-link",
    title: "Content Syndication Credit Link Tool",
    description:
      "Render an explicitly asserted syndication source credit without verifying ownership or reuse rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        itemId: { type: "string", maxLength: 8192 },
        originalPublisher: { type: "string", maxLength: 8192 },
        sourceReference: { type: "string", maxLength: 8192 },
      },
      required: ["itemId", "originalPublisher", "sourceReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { credit: { type: "string", maxLength: 8192 } },
      required: ["credit"],
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
          id: "originalPublisher",
          label: "Original Publisher",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "credit", label: "Credit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = contentSyndicationCreditLinkTool.execute;
export default contentSyndicationCreditLinkTool;
