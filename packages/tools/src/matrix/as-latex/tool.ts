import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseNumericMatrix } from "../../parse/matrix/tool.js";

export const matrixAsLatex = (text: string): string | null => {
  const matrix = parseNumericMatrix(text);
  if (!matrix) return null;
  const rows = matrix.values.map((row) => row.join(" & ")).join(" \\\\\n");
  return `\\begin{bmatrix}\n${rows}\n\\end{bmatrix}`;
};

export const matrixAsLatexExample = {
  input: { matrix: "[[1,2],[3,4]]" },
  output: { latex: "\\begin{bmatrix}\n1 & 2 \\\\\n3 & 4\n\\end{bmatrix}" },
} satisfies ToolExample<
  { readonly matrix: string },
  { readonly latex: string }
>;

export const matrixAsLatexTool = createSimpleTool({
  id: "matrix/as-latex",
  title: "Matrix as LaTeX",
  description: "Convert a numeric matrix into LaTeX bmatrix markup.",
  inputs: [
    { format: "matrix/number", id: "matrix", kind: "string", label: "Matrix" },
  ],
  outputs: [
    { format: "text/latex", id: "latex", kind: "string", label: "LaTeX" },
  ],
  calculate: (input) => {
    const latex = matrixAsLatex(input.matrix as string);
    if (latex === null)
      return simpleError("matrix", "Enter a valid numeric matrix.");
    return { latex };
  },
});

export const runMatrixAsLatex = matrixAsLatexTool.execute;
export default matrixAsLatexTool;
