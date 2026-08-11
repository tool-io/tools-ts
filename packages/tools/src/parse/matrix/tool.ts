import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NumericMatrix = {
  readonly columns: number;
  readonly kind: "matrix/number";
  readonly rows: number;
  readonly values: readonly (readonly number[])[];
  readonly version: 1;
};

const parseRows = (input: unknown): unknown[][] | null => {
  if (Array.isArray(input)) return input.every(Array.isArray) ? input : null;
  if (typeof input !== "string") return null;
  const source = input.trim();
  if (!source) return null;
  if (source.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(source);
      if (!Array.isArray(parsed) || !parsed.every(Array.isArray)) return null;
      return parsed;
    } catch {
      return null;
    }
  }
  return source
    .split(/\r?\n/)
    .filter((row) => row.trim())
    .map((row) => row.trim().split(/(?:\s*,\s*|\s+)/));
};

export const parseNumericMatrix = (input: unknown): NumericMatrix | null => {
  const candidate =
    typeof input === "object" &&
    input !== null &&
    !Array.isArray(input) &&
    "values" in input
      ? (input as { readonly values: unknown }).values
      : input;
  const rows = parseRows(candidate);
  if (!rows || rows.length === 0) return null;
  const columns = rows[0]?.length ?? 0;
  if (
    !columns ||
    rows.some((row) => row.length !== columns) ||
    rows.length * columns > 100_000
  )
    return null;
  const values = rows.map((row) =>
    row.map((cell) => {
      if (
        (typeof cell !== "number" && typeof cell !== "string") ||
        String(cell).trim() === ""
      )
        return Number.NaN;
      return Number(cell);
    }),
  );
  if (values.some((row) => row.some((value) => !Number.isFinite(value))))
    return null;
  return {
    columns,
    kind: "matrix/number",
    rows: values.length,
    values,
    version: 1,
  };
};

export const matrixParserExample = {
  input: { text: "1, 2, 3\n4, 5, 6" },
  output: {
    matrix: {
      columns: 3,
      kind: "matrix/number",
      rows: 2,
      values: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      version: 1,
    },
  },
} satisfies ToolExample<
  { readonly text: string },
  { readonly matrix: NumericMatrix }
>;

export const matrixParserTool = createSimpleTool({
  id: "parse/matrix",
  title: "Numeric Matrix Parser",
  description:
    "Parse a rectangular numeric matrix from JSON or comma- and space-separated rows.",
  inputs: [{ id: "text", kind: "string", label: "Matrix" }],
  outputs: [
    {
      format: "matrix/number",
      id: "matrix",
      kind: "object",
      label: "Parsed matrix",
    },
  ],
  calculate: (input) => {
    const matrix = parseNumericMatrix(input.text as string);
    if (!matrix)
      simpleError("text", "Enter a finite rectangular numeric matrix.");
    return { matrix };
  },
});

export const runMatrixParser = matrixParserTool.execute;
export default matrixParserTool;
