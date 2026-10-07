import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultCode: string;
  readonly indeterminateCodes: readonly string[];
  readonly missingCodes: readonly string[];
};
export type Output = {
  readonly indeterminate: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultCode: { type: "string", maxLength: 8192 },
    indeterminateCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["resultCode", "indeterminateCodes", "missingCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indeterminate: { type: "boolean" },
    missing: { type: "boolean" },
  },
  required: ["indeterminate", "missing"],
} as const;
/** Distinguish caller-defined indeterminate test-result codes from missing-result codes without reclassifying either as positive or negative. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultCode, indeterminateCodes, missingCodes } = request;
  const compute = (): Output => {
    H.domain(
      !indeterminateCodes.some((v) => missingCodes.includes(v)),
      "indeterminateCodes",
    );
    return {
      indeterminate: indeterminateCodes.includes(resultCode),
      missing: missingCodes.includes(resultCode),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultCode: "I",
    indeterminateCodes: ["I", "EQ"],
    missingCodes: ["NA"],
  },
  output: { indeterminate: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const diagnosticIndeterminateResultFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/diagnostic-indeterminate-result-flag",
    title: "Diagnostic Indeterminate Result Flag",
    description:
      "Distinguish caller-defined indeterminate test-result codes from missing-result codes without reclassifying either as positive or negative.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultCode: { type: "string", maxLength: 8192 },
        indeterminateCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["resultCode", "indeterminateCodes", "missingCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indeterminate: { type: "boolean" },
        missing: { type: "boolean" },
      },
      required: ["indeterminate", "missing"],
    },
    ports: {
      inputs: [
        {
          id: "resultCode",
          label: "Result Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "indeterminateCodes",
          label: "Indeterminate Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCodes",
          label: "Missing Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "indeterminate",
          label: "Indeterminate",
          valueType: { type: "boolean" },
        },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = diagnosticIndeterminateResultFlagTool.execute;
export default diagnosticIndeterminateResultFlagTool;
