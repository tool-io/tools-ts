import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousVoterCount: number;
  readonly revisedVoterCount: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousVoterCount: { type: "integer", minimum: 0 },
    revisedVoterCount: { type: "integer", minimum: 0 },
  },
  required: ["previousVoterCount", "revisedVoterCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "integer" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit previous voter-roll count from its revised count without identifying voters or assessing the revision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousVoterCount, revisedVoterCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousVoterCount) &&
        previousVoterCount >= 0 &&
        previousVoterCount <= Number.MAX_SAFE_INTEGER,
      "previousVoterCount",
    ),
      previousVoterCount);
    (H.domain(
      Number.isSafeInteger(revisedVoterCount) &&
        revisedVoterCount >= 0 &&
        revisedVoterCount <= Number.MAX_SAFE_INTEGER,
      "revisedVoterCount",
    ),
      revisedVoterCount);
    return { signedGap: revisedVoterCount - previousVoterCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousVoterCount: 12, revisedVoterCount: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const districtVoterRollRevisionDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["political-science", "political science", "social sciences"],
      keywords: ["political science", "social sciences"],
    },
    id: "political-science/district-voter-roll-revision-delta",
    title: "District Voter Roll Revision Delta",
    description:
      "Subtract an explicit previous voter-roll count from its revised count without identifying voters or assessing the revision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousVoterCount: { type: "integer", minimum: 0 },
        revisedVoterCount: { type: "integer", minimum: 0 },
      },
      required: ["previousVoterCount", "revisedVoterCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "integer" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "previousVoterCount",
          label: "Previous Voter Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "revisedVoterCount",
          label: "Revised Voter Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "signedGap",
          label: "Signed Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = districtVoterRollRevisionDeltaTool.execute;
export default districtVoterRollRevisionDeltaTool;
