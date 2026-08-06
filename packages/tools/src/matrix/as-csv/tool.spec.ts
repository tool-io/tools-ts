import { describe, expect, it } from "vitest";
import { matrixAsCsvExample, matrixAsCsv, runMatrixAsCsv } from "./tool.js";

describe("Matrix as CSV", () => {
  it("formats matrix rows", () =>
    expect(matrixAsCsv("1 2\n3 4")).toBe("1,2\n3,4"));
  it("rejects malformed matrices", () =>
    expect(runMatrixAsCsv({ matrix: "1 2\n3" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMatrixAsCsv(matrixAsCsvExample.input)).toEqual({
      ok: true,
      output: matrixAsCsvExample.output,
    }));
});
