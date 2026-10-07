import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly screeningId: string;
  readonly failureCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screeningId: { type: "string", maxLength: 8192, minLength: 1 },
    failureCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["screeningId", "failureCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit screening failure code by source without determining eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { screeningId, failureCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(screeningId.length > 0, "screeningId");
    H.domain(failureCode.length > 0, "failureCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([screeningId, failureCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { screeningId: "SCR17", failureCode: "F2", codeSource: "Protocol v2" },
  output: { token: '["SCR17","F2","Protocol v2"]' },
} satisfies ToolExample<Input, Output>;
export const clinicalStudyScreenFailCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "clinical-research",
        "clinical research",
        "research and quality management",
      ],
      keywords: ["clinical research", "research and quality management"],
    },
    id: "clinical-research/clinical-study-screen-fail-code",
    title: "Clinical Study Screen Fail Code",
    description:
      "Qualify an explicit screening failure code by source without determining eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        screeningId: { type: "string", maxLength: 8192, minLength: 1 },
        failureCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["screeningId", "failureCode", "codeSource"],
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
          id: "screeningId",
          label: "Screening Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "failureCode",
          label: "Failure Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = clinicalStudyScreenFailCodeTool.execute;
export default clinicalStudyScreenFailCodeTool;
