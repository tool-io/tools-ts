import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quoteId: string;
  readonly recordedPermissionStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quoteId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedPermissionStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["on-record", "off-record", "background", "unspecified"],
    },
  },
  required: ["quoteId", "recordedPermissionStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit quotation permission-status record without granting publication rights or inferring permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quoteId, recordedPermissionStatus } = request;
  const compute = (): Output => {
    H.domain(quoteId.length > 0, "quoteId");
    H.domain(
      ["on-record", "off-record", "background", "unspecified"].includes(
        recordedPermissionStatus,
      ),
      "recordedPermissionStatus",
    );
    return { label: quoteId + " [" + recordedPermissionStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quoteId: "Q17", recordedPermissionStatus: "off-record" },
  output: { label: "Q17 [off-record]" },
} satisfies ToolExample<Input, Output>;
export const mediaQuoteOnRecordOffRecordTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["media-studies", "media studies", "social sciences"],
      keywords: ["media studies", "social sciences"],
    },
    id: "media-studies/media-quote-on-record-off-record-tag",
    title: "Media Quote On Record Off Record Tag",
    description:
      "Label an explicit quotation permission-status record without granting publication rights or inferring permission.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quoteId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedPermissionStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["on-record", "off-record", "background", "unspecified"],
        },
      },
      required: ["quoteId", "recordedPermissionStatus"],
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
          id: "quoteId",
          label: "Quote Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedPermissionStatus",
          label: "Recorded Permission Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = mediaQuoteOnRecordOffRecordTagTool.execute;
export default mediaQuoteOnRecordOffRecordTagTool;
