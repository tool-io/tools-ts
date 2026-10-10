import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedServiceDateText: string;
  readonly precisionWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedServiceDateText: { type: "string", maxLength: 8192, minLength: 1 },
    precisionWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedServiceDateText", "precisionWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit veteran service-date transcription and precision without verifying service or eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedServiceDateText, precisionWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedServiceDateText.length > 0, "suppliedServiceDateText");
    H.domain(precisionWording.length > 0, "precisionWording");
    return {
      token: JSON.stringify([
        recordId,
        suppliedServiceDateText,
        precisionWording,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedServiceDateText: "1950",
    precisionWording: "year",
  },
  output: { token: '["R17","1950","year"]' },
} satisfies ToolExample<Input, Output>;
export const veteranServiceDatePrecisionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["military-science", "military science", "social sciences"],
      keywords: ["military science", "social sciences"],
    },
    id: "military-science/veteran-service-date-precision-label",
    title: "Veteran Service Date Precision Label",
    description:
      "Preserve an explicit veteran service-date transcription and precision without verifying service or eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedServiceDateText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        precisionWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedServiceDateText", "precisionWording"],
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
          id: "suppliedServiceDateText",
          label: "Supplied Service Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionWording",
          label: "Precision Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = veteranServiceDatePrecisionLabelTool.execute;
export default veteranServiceDatePrecisionLabelTool;
