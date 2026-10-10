import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issueDate: string;
  readonly replacementDate: string;
};
export type Output = { readonly signedGapDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issueDate: { type: "string", maxLength: 8192 },
    replacementDate: { type: "string", maxLength: 8192 },
  },
  required: ["issueDate", "replacementDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGapDays: { type: "number" } },
  required: ["signedGapDays"],
} as const;
/** Compare explicit retainer issue and replacement dates without recommending a replacement interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issueDate, replacementDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      signedGapDays:
        (namedDate(replacementDate, "replacementDate").getTime() -
          namedDate(issueDate, "issueDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issueDate: "2026-10-01", replacementDate: "2026-11-01" },
  output: { signedGapDays: 31 },
} satisfies ToolExample<Input, Output>;
export const retainerIssueReplacementGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["orthodontics", "health and medicine"],
      keywords: ["orthodontics", "health and medicine"],
    },
    id: "orthodontics/retainer-issue-replacement-gap",
    title: "Retainer Issue Replacement Gap",
    description:
      "Compare explicit retainer issue and replacement dates without recommending a replacement interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issueDate: { type: "string", maxLength: 8192 },
        replacementDate: { type: "string", maxLength: 8192 },
      },
      required: ["issueDate", "replacementDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGapDays: { type: "number" } },
      required: ["signedGapDays"],
    },
    ports: {
      inputs: [
        {
          id: "issueDate",
          label: "Issue Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "replacementDate",
          label: "Replacement Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedGapDays",
          label: "Signed Gap Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retainerIssueReplacementGapTool.execute;
export default retainerIssueReplacementGapTool;
