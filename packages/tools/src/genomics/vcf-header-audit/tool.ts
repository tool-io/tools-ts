import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type Input = Readonly<{
  readonly header: string;
  readonly requireContigDefinitions: boolean;
}>;
export type Output = Readonly<{
  readonly valid: boolean;
  readonly issues: readonly string[];
  readonly sampleNames: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const lines = input.header.split(/\r?\n/).filter((v) => v.length),
    issues: string[] = [],
    columnLines = lines.filter((v) => v.startsWith("#CHROM")),
    columns = columnLines[0]?.split("\t") ?? [];
  if (!/^##fileformat=VCFv4\.[0-9]+$/.test(lines[0] ?? ""))
    issues.push("fileformat-first");
  const standard = [
    "#CHROM",
    "POS",
    "ID",
    "REF",
    "ALT",
    "QUAL",
    "FILTER",
    "INFO",
  ];
  if (
    columnLines.length !== 1 ||
    standard.some((v, i) => columns[i] !== v) ||
    (columns.length > 8 && (columns[8] !== "FORMAT" || columns.length < 10))
  )
    issues.push("columns");
  if (
    input.requireContigDefinitions &&
    !lines.some((v) => v.startsWith("##contig=<"))
  )
    issues.push("contig-definitions");
  const sampleNames = columns.slice(9);
  if (
    new Set(sampleNames).size !== sampleNames.length ||
    sampleNames.some((v) => !v)
  )
    issues.push("sample-identifiers");
  return { valid: issues.length === 0, issues, sampleNames };
};
export const exampleInput = {
  header:
    "##fileformat=VCFv4.3\n##contig=<ID=chr1>\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\n",
  requireContigDefinitions: true,
} satisfies Input;
export const exampleOutput = {
  valid: true,
  issues: [],
  sampleNames: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/vcf-header-audit",
  title: "VCF Header Audit",
  description:
    "Audit VCF fileformat, column header, optional contig declarations, and sample identifiers.",
  inputs: [
    { id: "header", label: "Header", kind: "string" },
    {
      id: "requireContigDefinitions",
      label: "Require contig definitions",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "valid", label: "Valid", kind: "boolean" },
    { id: "issues", label: "Issues", kind: "stringList" },
    { id: "sampleNames", label: "Sample names", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      header: value.header as string,
      requireContigDefinitions: value.requireContigDefinitions as boolean,
    }),
});
export const run = tool.execute;
export default tool;
