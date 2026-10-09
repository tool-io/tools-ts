import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly retractionRecordId: string;
  readonly sourceSystem: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    retractionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "retractionRecordId", "sourceSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Link an explicit result and retraction-record reference without deciding clinical validity or altering records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, retractionRecordId, sourceSystem } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0, "resultId");
    H.domain(retractionRecordId.length > 0, "retractionRecordId");
    H.domain(sourceSystem.length > 0, "sourceSystem");
    return {
      token: JSON.stringify([resultId, retractionRecordId, sourceSystem]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { resultId: "R17", retractionRecordId: "RET4", sourceSystem: "SYS2" },
  output: { token: '["R17","RET4","SYS2"]' },
} satisfies ToolExample<Input, Output>;
export const healthRecordRetractedResultLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-informatics/health-record-retracted-result-link",
    title: "Health Record Retracted Result Link Tool",
    description:
      "Link an explicit result and retraction-record reference without deciding clinical validity or altering records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        retractionRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "retractionRecordId", "sourceSystem"],
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
          id: "retractionRecordId",
          label: "Retraction Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceSystem",
          label: "Source System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = healthRecordRetractedResultLinkTool.execute;
export default healthRecordRetractedResultLinkTool;
