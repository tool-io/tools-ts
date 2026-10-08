import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelText: string;
  readonly dateText: string;
  readonly suppliedPrecision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelText: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["labelText", "dateText", "suppliedPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a historical term-use date transcription and explicit precision without validating a historical claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelText, dateText, suppliedPrecision } = request;
  const compute = (): Output => {
    H.domain(labelText.length > 0, "labelText");
    H.domain(dateText.length > 0, "dateText");
    H.domain(suppliedPrecision.length > 0, "suppliedPrecision");
    return { token: JSON.stringify([labelText, dateText, suppliedPrecision]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    labelText: "Term A",
    dateText: "circa 1900",
    suppliedPrecision: "approximate year",
  },
  output: { token: '["Term A","circa 1900","approximate year"]' },
} satisfies ToolExample<Input, Output>;
export const historicalLabelUseDatePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["critical-theory", "critical theory", "humanities"],
      keywords: ["critical theory", "humanities"],
    },
    id: "critical-theory/historical-label-use-date-precision",
    title: "Historical Label Use Date Precision",
    description:
      "Preserve a historical term-use date transcription and explicit precision without validating a historical claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelText: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["labelText", "dateText", "suppliedPrecision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "labelText",
          label: "Label Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPrecision",
          label: "Supplied Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = historicalLabelUseDatePrecisionTool.execute;
export default historicalLabelUseDatePrecisionTool;
