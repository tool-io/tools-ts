import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assayId: string;
  readonly controlId: string;
  readonly reportedMediumWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assayId: { type: "string", maxLength: 8192, minLength: 1 },
    controlId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedMediumWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["assayId", "controlId", "reportedMediumWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit assay-control medium label without formulating media or predicting assay outcomes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assayId, controlId, reportedMediumWording } = request;
  const compute = (): Output => {
    H.domain(assayId.length > 0, "assayId");
    H.domain(controlId.length > 0, "controlId");
    H.domain(reportedMediumWording.length > 0, "reportedMediumWording");
    return {
      token: JSON.stringify([assayId, controlId, reportedMediumWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assayId: "A17",
    controlId: "C2",
    reportedMediumWording: "serum-free label",
  },
  output: { token: '["A17","C2","serum-free label"]' },
} satisfies ToolExample<Input, Output>;
export const serumFreeAssayControlTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biotechnology", "biology"],
      keywords: ["biotechnology", "biology"],
    },
    id: "biotechnology/serum-free-assay-control-tag",
    title: "Serum Free Assay Control Tag",
    description:
      "Qualify an explicit assay-control medium label without formulating media or predicting assay outcomes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assayId: { type: "string", maxLength: 8192, minLength: 1 },
        controlId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedMediumWording: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["assayId", "controlId", "reportedMediumWording"],
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
          id: "assayId",
          label: "Assay Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "controlId",
          label: "Control Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedMediumWording",
          label: "Reported Medium Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = serumFreeAssayControlTagTool.execute;
export default serumFreeAssayControlTagTool;
