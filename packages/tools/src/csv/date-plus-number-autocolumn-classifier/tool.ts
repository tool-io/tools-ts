import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  daysBetween,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly cells: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cells", label: "Cells", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!i.cells.length) simpleError("cells", "Nonempty observed cells.");
  const kinds = i.cells.map((s) => {
    if (s === "") return "empty";
    if (
      /^-?(?:0|[1-9]\d*)(?:\.\d+)?$(?![\s\S])/.test(s) &&
      Number.isFinite(Number(s))
    )
      return "number";
    if (/^\d{4}-\d{2}-\d{2}$(?![\s\S])/.test(s)) {
      try {
        daysBetween(s, s);
        return "iso-date";
      } catch {
        return "text";
      }
    }
    return "text";
  });
  const nonempty = [...new Set(kinds.filter((s) => s !== "empty"))];
  return {
    cellKinds: kinds,
    columnKind:
      nonempty.length === 0
        ? "empty"
        : nonempty.length === 1
          ? nonempty[0]
          : "mixed",
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { cells: ["2026-01-01", "2", ""] },
  output: {
    result: { cellKinds: ["iso-date", "number", "empty"], columnKind: "mixed" },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "csv/date-plus-number-autocolumn-classifier",
  title: "Date+Number Autocolumn Classifier",
  description:
    "Strict observed ISO date/canonical decimal column classifier; no locale guesses, spreadsheet coercion or identifier inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cellKinds: { type: "array", items: { type: "string" } },
          columnKind: { type: "string" },
        },
        required: ["cellKinds", "columnKind"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
