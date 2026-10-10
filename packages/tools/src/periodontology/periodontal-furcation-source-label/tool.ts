import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly toothCode: string;
  readonly recordedCode: string;
  readonly gradingSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    toothCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
    gradingSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["toothCode", "recordedCode", "gradingSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit furcation assessment code and source without grading a lesion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { toothCode, recordedCode, gradingSource } = request;
  const compute = (): Output => {
    H.domain(toothCode.length > 0, "toothCode");
    H.domain(recordedCode.length > 0, "recordedCode");
    H.domain(gradingSource.length > 0, "gradingSource");
    return { token: JSON.stringify([toothCode, recordedCode, gradingSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { toothCode: "T17", recordedCode: "F-A", gradingSource: "Scale A v2" },
  output: { token: '["T17","F-A","Scale A v2"]' },
} satisfies ToolExample<Input, Output>;
export const periodontalFurcationSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["periodontology", "health and medicine"],
      keywords: ["periodontology", "health and medicine"],
    },
    id: "periodontology/periodontal-furcation-source-label",
    title: "Periodontal Furcation Source Label",
    description:
      "Record an explicit furcation assessment code and source without grading a lesion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        toothCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
        gradingSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["toothCode", "recordedCode", "gradingSource"],
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
          id: "toothCode",
          label: "Tooth Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gradingSource",
          label: "Grading Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = periodontalFurcationSourceLabelTool.execute;
export default periodontalFurcationSourceLabelTool;
