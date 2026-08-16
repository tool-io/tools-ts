import { CsvParseError, parseCsv } from "../../core/csv.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CsvToMarkdownInput = {
  readonly alignment?: string;
  readonly csv: string;
  readonly delimiter?: string;
  readonly hasHeader?: boolean;
};

export type CsvToMarkdownOutput = {
  readonly markdown: string;
};

const ALIGNMENT_SEPARATORS: Readonly<Record<string, string>> = {
  center: ":---:",
  left: ":---",
  none: "---",
  right: "---:",
};

export const csvToMarkdownExample = {
  input: { csv: "lang,cool\nTS,yes\n" },
  output: {
    markdown: "| lang | cool |\n| --- | --- |\n| TS | yes |",
  },
} satisfies ToolExample<CsvToMarkdownInput, CsvToMarkdownOutput>;

const escapeCell = (cell: string): string =>
  cell
    .replaceAll("|", "\\|")
    .replaceAll(/\r\n|\r|\n/gu, "<br>");

export const calculateCsvToMarkdown = (
  input: CsvToMarkdownInput,
): CsvToMarkdownOutput => {
  const delimiter = input.delimiter ?? ",";
  const hasHeader = input.hasHeader ?? true;
  let document;
  try {
    document = parseCsv(input.csv, { delimiter, hasHeader });
  } catch (error) {
    if (error instanceof CsvParseError)
      simpleError("csv", error.message, error.code);
    throw error;
  }
  const records = hasHeader && document.header
    ? [document.header, ...document.rows]
    : document.rows;
  if (records.length === 0)
    simpleError("csv", "CSV input needs at least one row.", "empty_csv");
  const width = records[0]!.length;
  for (const record of records)
    if (record.length !== width)
      simpleError(
        "csv",
        "Every CSV row must have the same number of cells.",
        "inconsistent_row_count",
      );
  const lines = records.map(
    (record) => `| ${record.map(escapeCell).join(" | ")} |`,
  );
  if (hasHeader && document.header) {
    const separator =
      ALIGNMENT_SEPARATORS[input.alignment ?? "none"] ??
      ALIGNMENT_SEPARATORS.none!;
    lines.splice(
      1,
      0,
      `| ${Array.from({ length: width }, () => separator).join(" | ")} |`,
    );
  }
  return { markdown: lines.join("\n") };
};

export const csvToMarkdownTool = createSimpleTool({
  calculate: (input) =>
    calculateCsvToMarkdown(input as unknown as CsvToMarkdownInput),
  description: "Convert RFC 4180 CSV text to a Markdown table.",
  id: "convert/csv-to-markdown",
  inputs: [
    {
      description: "CSV text to convert.",
      id: "csv",
      kind: "string",
      label: "CSV",
    },
    {
      default: ",",
      description: "Single-character field delimiter.",
      enum: [",", ";", "\t", "|"],
      id: "delimiter",
      kind: "string",
      label: "Delimiter",
    },
    {
      default: true,
      description:
        "Treat the first row as a header row with an alignment separator.",
      id: "hasHeader",
      kind: "boolean",
      label: "First row is header",
    },
    {
      default: "none",
      description: "Column alignment declared in the header separator row.",
      enum: ["left", "center", "right", "none"],
      id: "alignment",
      kind: "string",
      label: "Alignment",
    },
  ],
  outputs: [
    {
      description: "Serialized Markdown table.",
      format: "text/markdown",
      id: "markdown",
      kind: "string",
      label: "Markdown table",
    },
  ],
  title: "CSV to Markdown Table Converter",
});
export const runCsvToMarkdown = csvToMarkdownTool.execute;
export default csvToMarkdownTool;
