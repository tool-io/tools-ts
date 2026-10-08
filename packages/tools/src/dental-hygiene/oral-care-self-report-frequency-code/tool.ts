import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly allowedResponses: readonly string[];
  readonly missingCode: string;
};
export type Output = {
  readonly recognized: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    allowedResponses: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCode: { type: "string", maxLength: 8192 },
  },
  required: ["response", "allowedResponses", "missingCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recognized: { type: "boolean" }, missing: { type: "boolean" } },
  required: ["recognized", "missing"],
} as const;
/** Recognize a literal oral-care self-report frequency code against an explicit response list without converting it into advice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, allowedResponses, missingCode } = request;
  const compute = (): Output => {
    H.domain(!allowedResponses.includes(missingCode), "allowedResponses");
    return {
      recognized: allowedResponses.includes(response),
      missing: response === missingCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    response: "twice daily",
    allowedResponses: ["once daily", "twice daily"],
    missingCode: "NA",
  },
  output: { recognized: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const oralCareSelfReportFrequencyCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/oral-care-self-report-frequency-code",
    title: "Oral Care Self Report Frequency Code",
    description:
      "Recognize a literal oral-care self-report frequency code against an explicit response list without converting it into advice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        allowedResponses: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCode: { type: "string", maxLength: 8192 },
      },
      required: ["response", "allowedResponses", "missingCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recognized: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["recognized", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedResponses",
          label: "Allowed Responses",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCode",
          label: "Missing Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "recognized",
          label: "Recognized",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = oralCareSelfReportFrequencyCodeTool.execute;
export default oralCareSelfReportFrequencyCodeTool;
