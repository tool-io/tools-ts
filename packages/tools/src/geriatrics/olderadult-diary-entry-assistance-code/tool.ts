import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly assistanceCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    assistanceCode: {
      type: "string",
      maxLength: 8192,
      enum: ["independent", "assisted", "proxy-entered", "unknown"],
    },
  },
  required: ["entryId", "assistanceCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly reported older-adult diary entry assistance without inferring decisional capacity or record accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, assistanceCode } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(
      ["independent", "assisted", "proxy-entered", "unknown"].includes(
        assistanceCode,
      ),
      "assistanceCode",
    );
    return { label: entryId + " [" + assistanceCode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "E17", assistanceCode: "assisted" },
  output: { label: "E17 [assisted]" },
} satisfies ToolExample<Input, Output>;
export const olderadultDiaryEntryAssistanceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/olderadult-diary-entry-assistance-code",
    title: "Older Adult Diary Entry Assistance Code Tool",
    description:
      "Label explicitly reported older-adult diary entry assistance without inferring decisional capacity or record accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        assistanceCode: {
          type: "string",
          maxLength: 8192,
          enum: ["independent", "assisted", "proxy-entered", "unknown"],
        },
      },
      required: ["entryId", "assistanceCode"],
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
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assistanceCode",
          label: "Assistance Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = olderadultDiaryEntryAssistanceCodeTool.execute;
export default olderadultDiaryEntryAssistanceCodeTool;
