import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCode: string;
  readonly missingCodes: readonly string[];
};
export type Output = { readonly missing: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCode: { type: "string", maxLength: 8192 },
    missingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["recordedCode", "missingCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { missing: { type: "boolean" } },
  required: ["missing"],
} as const;
/** Check literal membership in a supplied questionnaire missing-code list without treating a scored zero as missing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCode, missingCodes } = request;
  const compute = (): Output => {
    return { missing: missingCodes.includes(recordedCode) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCode: "NA", missingCodes: ["NA", "NR"] },
  output: { missing: true },
} satisfies ToolExample<Input, Output>;
export const psychiatricQuestionnaireMissingCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["psychiatry", "health and medicine"],
        keywords: ["psychiatry", "health and medicine"],
      },
      id: "psychiatry/psychiatric-questionnaire-missing-code",
      title: "Psychiatric Questionnaire Missing Code",
      description:
        "Check literal membership in a supplied questionnaire missing-code list without treating a scored zero as missing.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedCode: { type: "string", maxLength: 8192 },
          missingCodes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["recordedCode", "missingCodes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { missing: { type: "boolean" } },
        required: ["missing"],
      },
      ports: {
        inputs: [
          {
            id: "recordedCode",
            label: "Recorded Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "missingCodes",
            label: "Missing Codes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          { id: "missing", label: "Missing", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = psychiatricQuestionnaireMissingCodeTool.execute;
export default psychiatricQuestionnaireMissingCodeTool;
