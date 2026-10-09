import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedOnsetText: string;
  readonly precisionCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedOnsetText: { type: "string", maxLength: 8192, minLength: 1 },
    precisionCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedOnsetText", "precisionCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve supplied onset transcription and precision in an outbreak line list without constructing an exact date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedOnsetText, precisionCode } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedOnsetText.length > 0, "suppliedOnsetText");
    H.domain(precisionCode.length > 0, "precisionCode");
    return {
      token: JSON.stringify([recordId, suppliedOnsetText, precisionCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedOnsetText: "2026-11-01",
    precisionCode: "day",
  },
  output: { token: '["R17","2026-11-01","day"]' },
} satisfies ToolExample<Input, Output>;
export const outbreakLineListOnsetPrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/outbreak-line-list-onset-precision",
    title: "Outbreak Line List Onset Precision Tool",
    description:
      "Preserve supplied onset transcription and precision in an outbreak line list without constructing an exact date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedOnsetText: { type: "string", maxLength: 8192, minLength: 1 },
        precisionCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedOnsetText", "precisionCode"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedOnsetText",
          label: "Supplied Onset Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionCode",
          label: "Precision Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = outbreakLineListOnsetPrecisionTool.execute;
export default outbreakLineListOnsetPrecisionTool;
