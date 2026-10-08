import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly lithologyCode: string;
  readonly classificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    lithologyCode: { type: "string", maxLength: 8192, minLength: 1 },
    classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "lithologyCode", "classificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a literal lithology code and its supplied source without identifying a rock type. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, lithologyCode, classificationSource } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(lithologyCode.length > 0, "lithologyCode");
    H.domain(classificationSource.length > 0, "classificationSource");
    return {
      token: JSON.stringify([sampleId, lithologyCode, classificationSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    lithologyCode: "L-A",
    classificationSource: "Log key v3",
  },
  output: { token: '["S17","L-A","Log key v3"]' },
} satisfies ToolExample<Input, Output>;
export const sampleLithologySourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "earth-science",
        "earth science",
        "earth and environmental sciences",
      ],
      keywords: ["earth science", "earth and environmental sciences"],
    },
    id: "earth-science/sample-lithology-source-key",
    title: "Sample Lithology Source Key",
    description:
      "Record a literal lithology code and its supplied source without identifying a rock type.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        lithologyCode: { type: "string", maxLength: 8192, minLength: 1 },
        classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "lithologyCode", "classificationSource"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lithologyCode",
          label: "Lithology Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "classificationSource",
          label: "Classification Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sampleLithologySourceKeyTool.execute;
export default sampleLithologySourceKeyTool;
