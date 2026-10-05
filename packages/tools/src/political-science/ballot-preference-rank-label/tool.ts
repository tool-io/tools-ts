import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rank: number; readonly candidateCode: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rank: { type: "integer", minimum: 1 },
    candidateCode: { type: "string", maxLength: 8192 },
  },
  required: ["rank", "candidateCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied positive ballot preference rank without interpreting or recommending a vote. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rank, candidateCode } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rank) &&
        rank >= 1 &&
        rank <= Number.MAX_SAFE_INTEGER,
      "rank",
    ),
      rank);
    H.domain(candidateCode.length > 0, "candidateCode");
    return { label: "Preference " + rank + ": " + candidateCode };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rank: 2, candidateCode: "C17" },
  output: { label: "Preference 2: C17" },
} satisfies ToolExample<Input, Output>;
export const ballotPreferenceRankLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "political-science/ballot-preference-rank-label",
    title: "Ballot Preference Rank Label Tool",
    description:
      "Label a supplied positive ballot preference rank without interpreting or recommending a vote.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rank: { type: "integer", minimum: 1 },
        candidateCode: { type: "string", maxLength: 8192 },
      },
      required: ["rank", "candidateCode"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "rank",
          label: "Rank",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "candidateCode",
          label: "Candidate Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ballotPreferenceRankLabelTool.execute;
export default ballotPreferenceRankLabelTool;
