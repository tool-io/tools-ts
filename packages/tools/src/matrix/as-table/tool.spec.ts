import { describe, expect, it } from "vitest";
import {
  matrixAsTable,
  matrixAsTableExample,
  runMatrixAsTable,
} from "./tool.js";

describe("Matrix as Table", () => {
  it("creates numbered columns", () =>
    expect(matrixAsTable("1 2")?.schema.fields[1]?.id).toBe("column-2"));
  it("formats canonical matrix values from a chain", () =>
    expect(
      matrixAsTable({
        values: [
          [1, 2],
          [3, 4],
        ],
      })?.rows,
    ).toEqual([
      [1, 2],
      [3, 4],
    ]));
  it("rejects malformed matrices", () =>
    expect(runMatrixAsTable({ matrix: "1 2\n3" }).ok).toBe(false));
  it("publishes an executable example", () =>
    expect(runMatrixAsTable(matrixAsTableExample.input)).toEqual({
      ok: true,
      output: matrixAsTableExample.output,
    }));
});
