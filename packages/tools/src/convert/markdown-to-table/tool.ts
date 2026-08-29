import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import {
  coerceTextTableCell,
  inferTextTableDataType,
  tableFieldIds,
} from "../../table/adapters.js";
import type { TableData } from "../../table/definition.js";

export type MarkdownToTableInput = {
  readonly inferTypes?: boolean;
  readonly markdown: string;
};
export type MarkdownToTableOutput = { readonly table: TableData };

const splitRow = (line: string): string[] => {
  const trimmed = line.trim().replace(/^\|/u, "").replace(/\|$/u, "");
  const cells: string[] = [];
  let cell = "";
  let escaped = false;
  for (const character of trimmed) {
    if (escaped) {
      cell +=
        character === "|" || character === "\\" ? character : `\\${character}`;
      escaped = false;
    } else if (character === "\\") {
      escaped = true;
    } else if (character === "|") {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += character;
    }
  }
  if (escaped) cell += "\\";
  cells.push(cell.trim());
  return cells;
};

const separatorCellPattern = /^:?-{3,}:?$/u;

export const calculateMarkdownToTable = (
  input: MarkdownToTableInput,
): MarkdownToTableOutput => {
  const lines = input.markdown.split(/\r?\n/u).map((line) => line.trim());
  const separator = lines.findIndex((line, index) => {
    const cells = splitRow(line);
    return (
      index > 0 &&
      lines[index - 1] !== "" &&
      cells.length > 0 &&
      cells.every((cell) => separatorCellPattern.test(cell)) &&
      splitRow(lines[index - 1]!).length === cells.length
    );
  });
  const firstBlankAfterTable = lines.indexOf("", separator + 1);
  const bodyEnd =
    firstBlankAfterTable < 0 ? lines.length : firstBlankAfterTable;
  if (separator < 1 || separator + 1 >= bodyEnd)
    simpleError(
      "markdown",
      "Enter a Markdown table with a header, separator row, and at least one data row.",
      "table_required",
    );

  const labels = splitRow(lines[separator - 1]!);
  const rows = lines.slice(separator + 1, bodyEnd).map(splitRow);
  if (labels.length === 0 || labels.some((label) => label === ""))
    simpleError("markdown", "Every Markdown table column needs a header.");
  if (rows.some((row) => row.length !== labels.length))
    simpleError(
      "markdown",
      "Every Markdown table row must contain the same number of cells as the header.",
      "inconsistent_row_count",
    );
  if (rows.length * labels.length > toolResourceLimits.generatedValues)
    simpleError(
      "markdown",
      `The table must not exceed ${toolResourceLimits.generatedValues.toLocaleString("en-US")} cells.`,
      "resource_limit_exceeded",
    );
  const types = labels.map((_, column) =>
    input.inferTypes === false
      ? ({ kind: "string" } as const)
      : inferTextTableDataType(rows.map((row) => row[column]!)),
  );
  const ids = tableFieldIds(labels);
  return {
    table: {
      kind: "tool.io/table",
      rows: rows.map((row) =>
        row.map((cell, column) => coerceTextTableCell(cell, types[column]!)),
      ),
      schema: {
        fields: labels.map((label, column) => ({
          dataType: types[column]!,
          id: ids[column]!,
          label,
          nullable: rows.some((row) => row[column]?.trim() === ""),
        })),
      },
      version: 1,
    },
  };
};

export const markdownToTableExample = {
  input: {
    markdown:
      "| Year | Strikes |\n| ---: | ---: |\n| 2024 | 317 |\n| 2025 | 284 |",
  },
  output: {
    table: {
      kind: "tool.io/table",
      rows: [
        [2024, 317],
        [2025, 284],
      ],
      schema: {
        fields: [
          {
            dataType: { bits: 64, kind: "integer", signed: true },
            id: "year",
            label: "Year",
            nullable: false,
          },
          {
            dataType: { bits: 64, kind: "integer", signed: true },
            id: "strikes",
            label: "Strikes",
            nullable: false,
          },
        ],
      },
      version: 1,
    },
  },
} satisfies ToolExample<MarkdownToTableInput, MarkdownToTableOutput>;

export const markdownToTableTool = createSimpleTool({
  calculate: (input) =>
    calculateMarkdownToTable({
      inferTypes: input.inferTypes as boolean | undefined,
      markdown: input.markdown as string,
    }),
  description:
    "Convert a GitHub-style Markdown pipe table into canonical tool.io TableData, including escaped pipes, empty cells, and inferred column types.",
  id: "convert/markdown-to-table",
  inputs: [
    { id: "markdown", kind: "string", label: "Markdown table" },
    {
      default: true,
      id: "inferTypes",
      kind: "boolean",
      label: "Infer column types",
    },
  ],
  outputs: [
    { format: "tool.io/table", id: "table", kind: "object", label: "Table" },
  ],
  title: "Markdown to Table",
});

export const runMarkdownToTable = markdownToTableTool.execute;
export default markdownToTableTool;
