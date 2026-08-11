import { describe, expect, it } from "vitest";
import { matrixAsJson, matrixAsJsonExample, runMatrixAsJson } from "./tool.js";

describe("Matrix as JSON", () => {
  it("supports compact JSON", () =>
    expect(matrixAsJson("1 2\n3 4", 0)).toBe("[[1,2],[3,4]]"));
  it("formats canonical matrix values from a chain", () =>
    expect(
      matrixAsJson(
        {
          values: [
            [1, 2],
            [3, 4],
          ],
        },
        0,
      ),
    ).toBe("[[1,2],[3,4]]"));
  it("rejects unsupported indentation", () =>
    expect(runMatrixAsJson({ indentation: 3, matrix: "1" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMatrixAsJson(matrixAsJsonExample.input)).toEqual({
      ok: true,
      output: matrixAsJsonExample.output,
    }));
});
