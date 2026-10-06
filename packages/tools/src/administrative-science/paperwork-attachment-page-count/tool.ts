import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mainPages: number;
  readonly attachmentPageCounts: readonly number[];
};
export type Output = { readonly totalPages: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mainPages: { type: "integer", minimum: 0 },
    attachmentPageCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["mainPages", "attachmentPageCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { totalPages: { type: "integer" } },
  required: ["totalPages"],
} as const;
/** Add explicitly supplied main-document and attachment page counts using exact integer accumulation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mainPages, attachmentPageCounts } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(mainPages) &&
        mainPages >= 0 &&
        mainPages <= Number.MAX_SAFE_INTEGER,
      "mainPages",
    ),
      mainPages);
    attachmentPageCounts.forEach(
      (value) => (
        H.domain(
          Number.isSafeInteger(value) &&
            value >= 0 &&
            value <= Number.MAX_SAFE_INTEGER,
          "attachmentPageCounts",
        ),
        value
      ),
    );
    return {
      totalPages: Number(
        attachmentPageCounts.reduce(
          (sum, value) => sum + BigInt(value),
          BigInt(mainPages),
        ),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mainPages: 5, attachmentPageCounts: [2, 3] },
  output: { totalPages: 10 },
} satisfies ToolExample<Input, Output>;
export const paperworkAttachmentPageCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/paperwork-attachment-page-count",
    title: "Paperwork Attachment Page Count",
    description:
      "Add explicitly supplied main-document and attachment page counts using exact integer accumulation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mainPages: { type: "integer", minimum: 0 },
        attachmentPageCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["mainPages", "attachmentPageCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { totalPages: { type: "integer" } },
      required: ["totalPages"],
    },
    ports: {
      inputs: [
        {
          id: "mainPages",
          label: "Main Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "attachmentPageCounts",
          label: "Attachment Page Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "totalPages",
          label: "Total Pages",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = paperworkAttachmentPageCountTool.execute;
export default paperworkAttachmentPageCountTool;
