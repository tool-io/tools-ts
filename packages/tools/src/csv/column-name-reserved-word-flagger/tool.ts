import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly columnNames: readonly string[];
  readonly callerReservedWords: readonly string[];
  readonly callerDialectEdition: string;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "columnNames", label: "Column names", kind: "stringList" },
  {
    id: "callerReservedWords",
    label: "Caller reserved words",
    kind: "stringList",
  },
  {
    id: "callerDialectEdition",
    label: "Caller dialect edition",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  if (!i.callerDialectEdition.trim())
    simpleError("dialect", "Explicit SQL dialect/edition.");
  if (
    !i.callerReservedWords.length ||
    i.callerReservedWords.some((s) => !s.trim())
  )
    simpleError("words", "Actual qualified reserved tokens.");
  const reserved = new Set(i.callerReservedWords.map((s) => s.toUpperCase()));
  return {
    flaggedColumnIndices: i.columnNames.flatMap((s, j) =>
      reserved.has(s.toUpperCase()) ? [j] : [],
    ),
    dialectEdition: i.callerDialectEdition,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    columnNames: ["id", "select", "name"],
    callerReservedWords: ["SELECT", "FROM"],
    callerDialectEdition: "illustrative-dialect/edition",
  },
  output: {
    result: {
      flaggedColumnIndices: [1],
      dialectEdition: "illustrative-dialect/edition",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "csv/column-name-reserved-word-flagger",
  title: "Reserved Word Column Name Flagger",
  description:
    "Exact case-insensitive caller SQL-dialect reserved-token flags; quoting rules and full SQL validity omitted.",
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
          flaggedColumnIndices: { type: "array", items: { type: "number" } },
          dialectEdition: { type: "string" },
        },
        required: ["flaggedColumnIndices", "dialectEdition"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
