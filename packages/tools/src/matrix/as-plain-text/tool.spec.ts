import { describe, expect, it } from "vitest";
import {
  matrixAsPlainText,
  matrixAsPlainTextExample,
  runMatrixAsPlainText,
} from "./tool.js";

describe("Matrix as Plain Text", () => {
  it("aligns columns", () =>
    expect(matrixAsPlainText("1 20\n300 4")).toBe("  1  20\n300   4"));
  it("rejects malformed matrices", () =>
    expect(runMatrixAsPlainText({ matrix: "1 2\n3" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMatrixAsPlainText(matrixAsPlainTextExample.input)).toEqual({
      ok: true,
      output: matrixAsPlainTextExample.output,
    }));
});
