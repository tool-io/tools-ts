import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copyId: string;
  readonly recordedCopyStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copyId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCopyStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["numbered-series", "out-of-series", "proof", "unspecified"],
    },
  },
  required: ["copyId", "recordedCopyStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded edition-copy status without assigning edition authenticity or value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { copyId, recordedCopyStatus } = request;
  const compute = (): Output => {
    H.domain(copyId.length > 0, "copyId");
    H.domain(
      ["numbered-series", "out-of-series", "proof", "unspecified"].includes(
        recordedCopyStatus,
      ),
      "recordedCopyStatus",
    );
    return { label: copyId + " [" + recordedCopyStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { copyId: "COPY17", recordedCopyStatus: "out-of-series" },
  output: { label: "COPY17 [out-of-series]" },
} satisfies ToolExample<Input, Output>;
export const artEditionOutOfSeriesCopyTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-history", "art history", "arts and design"],
      keywords: ["art history", "arts and design"],
    },
    id: "art-history/art-edition-out-of-series-copy-tag",
    title: "Art Edition Out Of Series Copy Tag",
    description:
      "Label an explicitly recorded edition-copy status without assigning edition authenticity or value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        copyId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCopyStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["numbered-series", "out-of-series", "proof", "unspecified"],
        },
      },
      required: ["copyId", "recordedCopyStatus"],
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
          id: "copyId",
          label: "Copy Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCopyStatus",
          label: "Recorded Copy Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artEditionOutOfSeriesCopyTagTool.execute;
export default artEditionOutOfSeriesCopyTagTool;
