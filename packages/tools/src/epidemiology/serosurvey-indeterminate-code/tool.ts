import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCode: string;
  readonly indeterminateCode: string;
  readonly missingCode: string;
};
export type Output = {
  readonly indeterminate: boolean;
  readonly missing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCode: { type: "string", maxLength: 8192 },
    indeterminateCode: { type: "string", maxLength: 8192, minLength: 1 },
    missingCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordedCode", "indeterminateCode", "missingCode"],
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
/** Identify literal caller-supplied indeterminate and missing serosurvey codes without interpreting an assay. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCode, indeterminateCode, missingCode } = request;
  const compute = (): Output => {
    H.domain(
      indeterminateCode.length > 0 &&
        missingCode.length > 0 &&
        indeterminateCode !== missingCode,
      "indeterminateCode",
    );
    return {
      indeterminate: recordedCode === indeterminateCode,
      missing: recordedCode === missingCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCode: "I", indeterminateCode: "I", missingCode: "M" },
  output: { indeterminate: true, missing: false },
} satisfies ToolExample<Input, Output>;
export const serosurveyIndeterminateCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/serosurvey-indeterminate-code",
    title: "Serosurvey Indeterminate Code",
    description:
      "Identify literal caller-supplied indeterminate and missing serosurvey codes without interpreting an assay.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCode: { type: "string", maxLength: 8192 },
        indeterminateCode: { type: "string", maxLength: 8192, minLength: 1 },
        missingCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordedCode", "indeterminateCode", "missingCode"],
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
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "indeterminateCode",
          label: "Indeterminate Code",
          required: true,
          valueType: { type: "string" },
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
export const run = serosurveyIndeterminateCodeTool.execute;
export default serosurveyIndeterminateCodeTool;
