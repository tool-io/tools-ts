import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseNumericMatrix } from "../../parse/matrix/tool.js";

export const matrixAsPlainText = (text: string): string | null => {
  const matrix = parseNumericMatrix(text);
  if (!matrix) return null;
  const widths = Array.from({ length: matrix.columns }, (_, column) =>
    Math.max(...matrix.values.map((row) => String(row[column]).length)),
  );
  return matrix.values
    .map((row) =>
      row
        .map((value, column) => String(value).padStart(widths[column] ?? 0))
        .join("  "),
    )
    .join("\n");
};

export const matrixAsPlainTextExample = {
  input: { matrix: "[[1,20],[300,4]]" },
  output: { text: "  1  20\n300   4" },
} satisfies ToolExample<{ readonly matrix: string }, { readonly text: string }>;

export const matrixAsPlainTextTool = createSimpleTool({
  id: "matrix/as-plain-text",
  title: "Matrix as Plain Text",
  description: "Convert a numeric matrix into aligned plain-text rows.",
  inputs: [
    { format: "matrix/number", id: "matrix", kind: "string", label: "Matrix" },
  ],
  outputs: [
    { format: "text/plain", id: "text", kind: "string", label: "Plain text" },
  ],
  calculate: (input) => {
    const text = matrixAsPlainText(input.matrix as string);
    if (text === null)
      return simpleError("matrix", "Enter a valid numeric matrix.");
    return { text };
  },
});

export const runMatrixAsPlainText = matrixAsPlainTextTool.execute;
export default matrixAsPlainTextTool;
