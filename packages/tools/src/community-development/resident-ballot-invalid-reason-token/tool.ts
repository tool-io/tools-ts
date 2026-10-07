import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ballotRecordId: string;
  readonly suppliedReason: string;
  readonly ruleSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ballotRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
    ruleSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["ballotRecordId", "suppliedReason", "ruleSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied resident-ballot status reason and rule source without adjudicating a ballot. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ballotRecordId, suppliedReason, ruleSource } = request;
  const compute = (): Output => {
    H.domain(ballotRecordId.length > 0, "ballotRecordId");
    H.domain(suppliedReason.length > 0, "suppliedReason");
    H.domain(ruleSource.length > 0, "ruleSource");
    return {
      token: JSON.stringify([ballotRecordId, suppliedReason, ruleSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ballotRecordId: "B17",
    suppliedReason: "duplicate",
    ruleSource: "rules R4",
  },
  output: { token: '["B17","duplicate","rules R4"]' },
} satisfies ToolExample<Input, Output>;
export const residentBallotInvalidReasonTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "community-development",
        "community development",
        "social sciences",
      ],
      keywords: ["community development", "social sciences"],
    },
    id: "community-development/resident-ballot-invalid-reason-token",
    title: "Resident Ballot Invalid Reason Token",
    description:
      "Preserve a supplied resident-ballot status reason and rule source without adjudicating a ballot.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ballotRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
        ruleSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["ballotRecordId", "suppliedReason", "ruleSource"],
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
          id: "ballotRecordId",
          label: "Ballot Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReason",
          label: "Supplied Reason",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ruleSource",
          label: "Rule Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = residentBallotInvalidReasonTokenTool.execute;
export default residentBallotInvalidReasonTokenTool;
