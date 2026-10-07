import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly resultId: string; readonly censoring: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    censoring: {
      type: "string",
      maxLength: 8192,
      enum: ["none", "left", "right", "interval", "unspecified"],
    },
  },
  required: ["resultId", "censoring"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit result-censoring category without substituting a value or interpreting health significance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, censoring } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(
      ["none", "left", "right", "interval", "unspecified"].includes(censoring),
      "censoring",
    );
    return { label: resultId + " [" + censoring + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", censoring: "left" },
  output: { label: "R17 [left]" },
} satisfies ToolExample<Input, Output>;
export const biomonitoringCensoringCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biomonitoring", "biology"],
      keywords: ["biomonitoring", "biology"],
    },
    id: "biomonitoring/biomonitoring-censoring-code",
    title: "Biomonitoring Censoring Code",
    description:
      "Label an explicit result-censoring category without substituting a value or interpreting health significance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        censoring: {
          type: "string",
          maxLength: 8192,
          enum: ["none", "left", "right", "interval", "unspecified"],
        },
      },
      required: ["resultId", "censoring"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "censoring",
          label: "Censoring",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biomonitoringCensoringCodeTool.execute;
export default biomonitoringCensoringCodeTool;
