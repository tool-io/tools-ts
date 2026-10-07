import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly basisWording: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    basisWording: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "basisWording", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit biomonitoring creatinine-basis label without performing or validating a physiological correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, basisWording, source } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(basisWording.length > 0, "basisWording");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([resultId, basisWording, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    basisWording: "creatinine adjusted",
    source: "Lab A",
  },
  output: { token: '["R17","creatinine adjusted","Lab A"]' },
} satisfies ToolExample<Input, Output>;
export const biomonitoringCreatinineBasisLabelTool = H.defineSchemaCalculation<
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
    id: "biomonitoring/biomonitoring-creatinine-basis-label",
    title: "Biomonitoring Creatinine Basis Label",
    description:
      "Preserve an explicit biomonitoring creatinine-basis label without performing or validating a physiological correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        basisWording: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "basisWording", "source"],
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
          id: "basisWording",
          label: "Basis Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = biomonitoringCreatinineBasisLabelTool.execute;
export default biomonitoringCreatinineBasisLabelTool;
