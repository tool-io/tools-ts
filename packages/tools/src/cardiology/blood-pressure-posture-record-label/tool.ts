import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly postureWording: string;
  readonly postureSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    postureWording: { type: "string", maxLength: 8192, minLength: 1 },
    postureSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "postureWording", "postureSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach explicitly recorded posture wording to a blood-pressure record without interpreting the reading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, postureWording, postureSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(postureWording.length > 0, "postureWording");
    H.domain(postureSource.length > 0, "postureSource");
    return { token: JSON.stringify([recordId, postureWording, postureSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "BP17",
    postureWording: "seated",
    postureSource: "Observer A",
  },
  output: { token: '["BP17","seated","Observer A"]' },
} satisfies ToolExample<Input, Output>;
export const bloodPressurePostureRecordLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/blood-pressure-posture-record-label",
    title: "Blood Pressure Posture Record Label",
    description:
      "Attach explicitly recorded posture wording to a blood-pressure record without interpreting the reading.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        postureWording: { type: "string", maxLength: 8192, minLength: 1 },
        postureSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "postureWording", "postureSource"],
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
          id: "postureWording",
          label: "Posture Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "postureSource",
          label: "Posture Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bloodPressurePostureRecordLabelTool.execute;
export default bloodPressurePostureRecordLabelTool;
