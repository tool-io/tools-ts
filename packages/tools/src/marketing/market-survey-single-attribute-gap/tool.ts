import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedReferenceRating: number;
  readonly recordedAttributeRating: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedReferenceRating: { type: "number" },
    recordedAttributeRating: { type: "number" },
  },
  required: ["suppliedReferenceRating", "recordedAttributeRating"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit survey reference rating from a recorded single-attribute rating without fitting a preference model. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedReferenceRating, recordedAttributeRating } = request;
  const compute = (): Output => {
    return { signedGap: recordedAttributeRating - suppliedReferenceRating };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedReferenceRating: 12, recordedAttributeRating: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const marketSurveySingleAttributeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["marketing", "business and finance"],
      keywords: ["marketing", "business and finance"],
    },
    id: "marketing/market-survey-single-attribute-gap",
    title: "Market Survey Single Attribute Gap",
    description:
      "Subtract an explicit survey reference rating from a recorded single-attribute rating without fitting a preference model.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedReferenceRating: { type: "number" },
        recordedAttributeRating: { type: "number" },
      },
      required: ["suppliedReferenceRating", "recordedAttributeRating"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedReferenceRating",
          label: "Supplied Reference Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedAttributeRating",
          label: "Recorded Attribute Rating",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = marketSurveySingleAttributeGapTool.execute;
export default marketSurveySingleAttributeGapTool;
