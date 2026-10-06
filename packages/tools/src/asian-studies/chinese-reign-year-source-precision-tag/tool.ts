import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedReignYearText: string;
  readonly precisionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReignYearText: { type: "string", maxLength: 8192, minLength: 1 },
    precisionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedReignYearText", "precisionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit reign-year transcription by precision source without converting to a Gregorian date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedReignYearText, precisionSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedReignYearText.length > 0, "suppliedReignYearText");
    H.domain(precisionSource.length > 0, "precisionSource");
    return {
      token: JSON.stringify([recordId, suppliedReignYearText, precisionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedReignYearText: "Reign year A",
    precisionSource: "Catalogue A",
  },
  output: { token: '["R17","Reign year A","Catalogue A"]' },
} satisfies ToolExample<Input, Output>;
export const chineseReignYearSourcePrecisionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/chinese-reign-year-source-precision-tag",
    title: "Chinese Reign Year Source Precision Tag",
    description:
      "Qualify an explicit reign-year transcription by precision source without converting to a Gregorian date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedReignYearText: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        precisionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedReignYearText", "precisionSource"],
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
          id: "suppliedReignYearText",
          label: "Supplied Reign Year Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "precisionSource",
          label: "Precision Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = chineseReignYearSourcePrecisionTagTool.execute;
export default chineseReignYearSourcePrecisionTagTool;
