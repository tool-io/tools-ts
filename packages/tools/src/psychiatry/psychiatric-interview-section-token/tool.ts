import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewId: string;
  readonly sectionCode: string;
  readonly instrumentVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewId: { type: "string", maxLength: 8192, minLength: 1 },
    sectionCode: { type: "string", maxLength: 8192, minLength: 1 },
    instrumentVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interviewId", "sectionCode", "instrumentVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Identify an explicitly recorded interview section within a supplied instrument version without determining a diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewId, sectionCode, instrumentVersion } = request;
  const compute = (): Output => {
    H.domain(interviewId.length > 0, "interviewId");
    H.domain(sectionCode.length > 0, "sectionCode");
    H.domain(instrumentVersion.length > 0, "instrumentVersion");
    return {
      token: JSON.stringify([interviewId, sectionCode, instrumentVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    interviewId: "INT17",
    sectionCode: "SEC-A",
    instrumentVersion: "v3",
  },
  output: { token: '["INT17","SEC-A","v3"]' },
} satisfies ToolExample<Input, Output>;
export const psychiatricInterviewSectionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["psychiatry", "health and medicine"],
      keywords: ["psychiatry", "health and medicine"],
    },
    id: "psychiatry/psychiatric-interview-section-token",
    title: "Psychiatric Interview Section Token",
    description:
      "Identify an explicitly recorded interview section within a supplied instrument version without determining a diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interviewId: { type: "string", maxLength: 8192, minLength: 1 },
        sectionCode: { type: "string", maxLength: 8192, minLength: 1 },
        instrumentVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["interviewId", "sectionCode", "instrumentVersion"],
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
          id: "interviewId",
          label: "Interview Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sectionCode",
          label: "Section Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "instrumentVersion",
          label: "Instrument Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = psychiatricInterviewSectionTokenTool.execute;
export default psychiatricInterviewSectionTokenTool;
