import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly subjectReference: string;
  readonly assigningSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192, minLength: 1 },
    subjectReference: { type: "string", maxLength: 8192, minLength: 1 },
    assigningSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordCode", "subjectReference", "assigningSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit subject reference and source without resolving or authenticating a health-record subject. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, subjectReference, assigningSource } = request;
  const compute = (): Output => {
    H.domain(recordCode.length > 0, "recordCode");
    H.domain(subjectReference.length > 0, "subjectReference");
    H.domain(assigningSource.length > 0, "assigningSource");
    return {
      token: JSON.stringify([recordCode, subjectReference, assigningSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCode: "OBS17",
    subjectReference: "Patient/p17",
    assigningSource: "System A",
  },
  output: { token: '["OBS17","Patient/p17","System A"]' },
} satisfies ToolExample<Input, Output>;
export const healthRecordSubjectReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/health-record-subject-reference",
    title: "Health Record Subject Reference",
    description:
      "Record an explicit subject reference and source without resolving or authenticating a health-record subject.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCode: { type: "string", maxLength: 8192, minLength: 1 },
        subjectReference: { type: "string", maxLength: 8192, minLength: 1 },
        assigningSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordCode", "subjectReference", "assigningSource"],
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
          id: "recordCode",
          label: "Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "subjectReference",
          label: "Subject Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assigningSource",
          label: "Assigning Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = healthRecordSubjectReferenceTool.execute;
export default healthRecordSubjectReferenceTool;
