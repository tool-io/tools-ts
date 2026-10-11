import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly fromStageCode: string;
  readonly toStageCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    fromStageCode: { type: "string", maxLength: 8192, minLength: 1 },
    toStageCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "fromStageCode", "toStageCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit administrative review-stage handoff without deciding case outcomes or workflow authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, fromStageCode, toStageCode } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(fromStageCode.length > 0, "fromStageCode");
    H.domain(toStageCode.length > 0, "toStageCode");
    return { token: JSON.stringify([caseId, fromStageCode, toStageCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseId: "CASE17", fromStageCode: "STAGE2", toStageCode: "STAGE3" },
  output: { token: '["CASE17","STAGE2","STAGE3"]' },
} satisfies ToolExample<Input, Output>;
export const administrativeReviewStageHandoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/administrative-review-stage-handoff",
    title: "Administrative Review Stage Handoff",
    description:
      "Qualify an explicit administrative review-stage handoff without deciding case outcomes or workflow authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseId: { type: "string", maxLength: 8192, minLength: 1 },
        fromStageCode: { type: "string", maxLength: 8192, minLength: 1 },
        toStageCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseId", "fromStageCode", "toStageCode"],
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
          id: "caseId",
          label: "Case Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "fromStageCode",
          label: "From Stage Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "toStageCode",
          label: "To Stage Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = administrativeReviewStageHandoffTool.execute;
export default administrativeReviewStageHandoffTool;
