import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copyId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copyId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["available", "withdrawn", "lost", "unknown"],
    },
  },
  required: ["copyId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded library-copy status without changing circulation records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { copyId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(copyId.length > 0, "copyId");
    H.domain(
      ["available", "withdrawn", "lost", "unknown"].includes(recordedStatus),
      "recordedStatus",
    );
    return { label: copyId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { copyId: "COPY17", recordedStatus: "withdrawn" },
  output: { label: "COPY17 [withdrawn]" },
} satisfies ToolExample<Input, Output>;
export const libraryCopyWithdrawnLostCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "library-science",
        "library science",
        "information and language sciences",
      ],
      keywords: ["library science", "information and language sciences"],
    },
    id: "library-science/library-copy-withdrawn-lost-code",
    title: "Library Copy Withdrawn Lost Code",
    description:
      "Label an explicitly recorded library-copy status without changing circulation records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        copyId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["available", "withdrawn", "lost", "unknown"],
        },
      },
      required: ["copyId", "recordedStatus"],
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
          id: "recordedStatus",
          label: "Recorded Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = libraryCopyWithdrawnLostCodeTool.execute;
export default libraryCopyWithdrawnLostCodeTool;
