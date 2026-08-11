import { describe, expect, it } from "vitest";
import {
  matrixParserExample,
  parseNumericMatrix,
  runMatrixParser,
} from "./tool.js";

describe("Numeric Matrix Parser", () => {
  it("parses row text and JSON", () => {
    expect(parseNumericMatrix("1,2\n3,4")?.values).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(parseNumericMatrix("[[1,2],[3,4]]")?.rows).toBe(2);
  });
  it("accepts nested arrays and canonical matrix values for chaining", () => {
    const matrix = parseNumericMatrix([
      [1, 2],
      [3, 4],
    ]);
    expect(matrix?.values).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(parseNumericMatrix(matrix)).toEqual(matrix);
  });
  it("rejects ragged and nonnumeric matrices", () => {
    expect(parseNumericMatrix("1,2\n3")).toBeNull();
    expect(parseNumericMatrix("1,x")).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runMatrixParser(matrixParserExample.input)).toEqual({
      ok: true,
      output: matrixParserExample.output,
    }));
});
