import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly resultText: string;
  readonly suppliedCensorCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    resultText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "resultText", "suppliedCensorCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit hormone assay result and censoring metadata without substituting values or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, resultText, suppliedCensorCode } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(resultText.length > 0, "resultText");
    H.domain(suppliedCensorCode.length > 0, "suppliedCensorCode");
    return {
      token: JSON.stringify([resultId, resultText, suppliedCensorCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    resultText: "<0.2",
    suppliedCensorCode: "left-censored",
  },
  output: { token: '["R17","<0.2","left-censored"]' },
} satisfies ToolExample<Input, Output>;
export const hormoneAssayLowerBoundCensorCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/hormone-assay-lower-bound-censor-code",
    title: "Hormone Assay Lower Bound Censor Code Tool",
    description:
      "Preserve explicit hormone assay result and censoring metadata without substituting values or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        resultText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedCensorCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "resultText", "suppliedCensorCode"],
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
          id: "resultId",
          label: "Result Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "resultText",
          label: "Result Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCensorCode",
          label: "Supplied Censor Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hormoneAssayLowerBoundCensorCodeTool.execute;
export default hormoneAssayLowerBoundCensorCodeTool;
