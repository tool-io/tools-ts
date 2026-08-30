import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly csvText: string;
  readonly normalizeLineEndings: boolean;
  readonly trimHeaderCells: boolean;
}>;
export type Output = Readonly<{
  readonly cleanedCsvText: string;
  readonly bomRemoved: boolean;
  readonly headerCellCount: number;
  readonly replacementCharacterCount: number;
}>;

export const calculate = (input: Input): Output => {
  let cleanedCsvText = input.csvText;
  const bomRemoved = cleanedCsvText.startsWith("\uFEFF");
  if (bomRemoved) cleanedCsvText = cleanedCsvText.slice(1);
  if (input.normalizeLineEndings)
    cleanedCsvText = cleanedCsvText.replace(/\r\n?/g, "\n");
  const lines = cleanedCsvText.split("\n");
  if (input.trimHeaderCells && lines.length > 0)
    lines[0] = lines[0]
      .split(",")
      .map((value) => value.trim())
      .join(",");
  cleanedCsvText = lines.join("\n");
  const headerCellCount = lines[0] ? lines[0].split(",").length : 0;
  return {
    cleanedCsvText,
    bomRemoved,
    headerCellCount,
    replacementCharacterCount: [...cleanedCsvText].filter(
      (value) => value === "�",
    ).length,
  };
};

export const exampleInput = {
  csvText: "﻿ name , age\r\nAda,36",
  normalizeLineEndings: true,
  trimHeaderCells: true,
} satisfies Input;
export const exampleOutput = {
  cleanedCsvText: "name,age\nAda,36",
  bomRemoved: true,
  headerCellCount: 2,
  replacementCharacterCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      csvText: input.csvText as string,
      normalizeLineEndings: input.normalizeLineEndings as boolean,
      trimHeaderCells: input.trimHeaderCells as boolean,
    }),
  description:
    "Remove a UTF-8 BOM, normalize line endings, and clean a CSV header.",
  id: "journalism/csv-text-cleaner",
  inputs: [
    { id: "csvText", label: "CSV text", kind: "string" },
    {
      id: "normalizeLineEndings",
      label: "Normalize line endings",
      kind: "boolean",
    },
    { id: "trimHeaderCells", label: "Trim header cells", kind: "boolean" },
  ],
  outputs: [
    { id: "cleanedCsvText", label: "Cleaned CSV text", kind: "string" },
    { id: "bomRemoved", label: "UTF-8 BOM removed", kind: "boolean" },
    {
      id: "headerCellCount",
      label: "Header cell count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "replacementCharacterCount",
      label: "Unicode replacement characters",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "CSV Text Cleaner",
});

export const run = tool.execute;
export default tool;
