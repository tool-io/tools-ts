import { describe, expect, it } from "vitest";
import {
  matrixAsLatex,
  matrixAsLatexExample,
  runMatrixAsLatex,
} from "./tool.js";

describe("Matrix as LaTeX", () => {
  it("formats a bmatrix", () =>
    expect(matrixAsLatex("1 2\n3 4")).toContain("1 & 2 \\\\"));
  it("rejects malformed matrices", () =>
    expect(runMatrixAsLatex({ matrix: "" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMatrixAsLatex(matrixAsLatexExample.input)).toEqual({
      ok: true,
      output: matrixAsLatexExample.output,
    }));
});
