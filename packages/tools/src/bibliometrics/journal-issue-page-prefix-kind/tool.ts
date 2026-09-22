import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly page: string };
export type Output = { readonly prefix: string; readonly numericPart: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { page: { type: "string", maxLength: 8192 } },
  required: ["page"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    numericPart: { type: "string", maxLength: 8192 },
  },
  required: ["prefix", "numericPart"],
} as const;
/** Split an ASCII supplement-style page prefix while preserving numeric spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { page } = request;
  const compute = (): Output => {
    const match = /^([A-Za-z]*)(\d+)(?![\s\S])/.exec(page);
    H.domain(match, "page");
    return { prefix: match[1], numericPart: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { page: "S0012" },
  output: { prefix: "S", numericPart: "0012" },
} satisfies ToolExample<Input, Output>;
export const journalIssuePagePrefixKindTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/journal-issue-page-prefix-kind",
    title: "Journal Issue Page Prefix Kind Tool",
    description:
      "Split an ASCII supplement-style page prefix while preserving numeric spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { page: { type: "string", maxLength: 8192 } },
      required: ["page"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        numericPart: { type: "string", maxLength: 8192 },
      },
      required: ["prefix", "numericPart"],
    },
    ports: {
      inputs: [
        {
          id: "page",
          label: "Page",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        {
          id: "numericPart",
          label: "Numeric Part",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = journalIssuePagePrefixKindTool.execute;
export default journalIssuePagePrefixKindTool;
