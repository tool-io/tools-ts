import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { count } from "../shared.js";

export type Input = Readonly<{
  readonly record: string;
  readonly expectedSampleCount: number;
}>;
export type Output = Readonly<{
  readonly columnCount: number;
  readonly valid: boolean;
  readonly issues: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  count(input.expectedSampleCount, "expectedSampleCount");
  const fields = input.record.trimEnd().split("\t"),
    issues: string[] = [],
    expected =
      input.expectedSampleCount === 0 ? 8 : 9 + input.expectedSampleCount;
  if (fields.length !== expected) issues.push("column-count");
  if (!fields[0] || fields[0].startsWith("#")) issues.push("chromosome");
  if (!/^[1-9][0-9]*$/.test(fields[1] ?? "")) issues.push("position");
  if (!/^[ACGTN]+$/i.test(fields[3] ?? "")) issues.push("reference");
  if (!fields[4]) issues.push("alternate");
  if (input.expectedSampleCount > 0 && (!fields[8] || fields[8] === "."))
    issues.push("format");
  return { columnCount: fields.length, valid: issues.length === 0, issues };
};
export const exampleInput = {
  record: "chr1\t100\t.\tA\tG\t30\tPASS\t.\tGT\t0/1",
  expectedSampleCount: 1,
} satisfies Input;
export const exampleOutput = {
  columnCount: 10,
  valid: true,
  issues: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/vcf-record-audit",
  title: "VCF Record Audit",
  description:
    "Audit VCF record field count and essential fields for the supplied number of samples.",
  inputs: [
    { id: "record", label: "Record", kind: "string" },
    {
      id: "expectedSampleCount",
      label: "Expected sample count",
      kind: "integer",
    },
  ],
  outputs: [
    { id: "columnCount", label: "Column count", kind: "integer" },
    { id: "valid", label: "Valid", kind: "boolean" },
    { id: "issues", label: "Issues", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      record: value.record as string,
      expectedSampleCount: value.expectedSampleCount as number,
    }),
});
export const run = tool.execute;
export default tool;
