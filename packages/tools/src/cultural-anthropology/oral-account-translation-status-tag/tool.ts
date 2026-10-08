import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly accountId: string;
  readonly translationStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accountId: { type: "string", maxLength: 8192, minLength: 1 },
    translationStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["original", "translated", "partial", "not-reviewed"],
    },
  },
  required: ["accountId", "translationStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit oral-account translation status without translating or verifying fidelity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accountId, translationStatus } = request;
  const compute = (): Output => {
    H.domain(accountId.length > 0, "accountId");
    H.domain(
      ["original", "translated", "partial", "not-reviewed"].includes(
        translationStatus,
      ),
      "translationStatus",
    );
    return { label: accountId + " [" + translationStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accountId: "A17", translationStatus: "translated" },
  output: { label: "A17 [translated]" },
} satisfies ToolExample<Input, Output>;
export const oralAccountTranslationStatusTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/oral-account-translation-status-tag",
    title: "Oral Account Translation Status Tag Tool",
    description:
      "Label an explicit oral-account translation status without translating or verifying fidelity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accountId: { type: "string", maxLength: 8192, minLength: 1 },
        translationStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["original", "translated", "partial", "not-reviewed"],
        },
      },
      required: ["accountId", "translationStatus"],
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
          id: "accountId",
          label: "Account Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "translationStatus",
          label: "Translation Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralAccountTranslationStatusTagTool.execute;
export default oralAccountTranslationStatusTagTool;
