import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedLabels: number;
  readonly returnedLabels: number;
};
export type Output = { readonly netIssuedLabels: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedLabels: { type: "integer", minimum: 0 },
    returnedLabels: { type: "integer", minimum: 0 },
  },
  required: ["issuedLabels", "returnedLabels"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netIssuedLabels: { type: "integer" } },
  required: ["netIssuedLabels"],
} as const;
/** Subtract explicit returned label counts from issued counts, preserving a negative reconciliation discrepancy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedLabels, returnedLabels } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(issuedLabels) &&
        issuedLabels >= 0 &&
        issuedLabels <= Number.MAX_SAFE_INTEGER,
      "issuedLabels",
    ),
      issuedLabels);
    (H.domain(
      Number.isSafeInteger(returnedLabels) &&
        returnedLabels >= 0 &&
        returnedLabels <= Number.MAX_SAFE_INTEGER,
      "returnedLabels",
    ),
      returnedLabels);
    return { netIssuedLabels: issuedLabels - returnedLabels };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedLabels: 120, returnedLabels: 15 },
  output: { netIssuedLabels: 105 },
} satisfies ToolExample<Input, Output>;
export const gmpLabelIssueMinusReturnTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gmp",
        "good manufacturing practice",
        "research and quality management",
      ],
      keywords: [
        "good manufacturing practice",
        "research and quality management",
        "GMP",
      ],
    },
    id: "gmp/gmp-label-issue-minus-return",
    title: "GMP Label Issue Minus Return",
    description:
      "Subtract explicit returned label counts from issued counts, preserving a negative reconciliation discrepancy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issuedLabels: { type: "integer", minimum: 0 },
        returnedLabels: { type: "integer", minimum: 0 },
      },
      required: ["issuedLabels", "returnedLabels"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netIssuedLabels: { type: "integer" } },
      required: ["netIssuedLabels"],
    },
    ports: {
      inputs: [
        {
          id: "issuedLabels",
          label: "Issued Labels",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returnedLabels",
          label: "Returned Labels",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "netIssuedLabels",
          label: "Net Issued Labels",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpLabelIssueMinusReturnTool.execute;
export default gmpLabelIssueMinusReturnTool;
