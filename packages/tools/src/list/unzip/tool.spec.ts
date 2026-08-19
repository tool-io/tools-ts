import { describe, expect, it } from "vitest";
import { calculateUnzip, runUnzip, unzipExample } from "./tool.js";

describe("list unzip tool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUnzip(unzipExample.input)).toEqual({
      ok: true,
      output: unzipExample.output,
    });
  });

  it("derives positional column names when none are provided", () => {
    const output = calculateUnzip({ table: { rows: [["a", 1], ["b", 2]] } });
    expect(output.columns).toEqual({
      "0": ["a", "b"],
      "1": [1, 2],
    });
  });

  it("rejects empty tables and ragged rows through execution", () => {
    expect(runUnzip({ table: { rows: [] } })).toMatchObject({
      error: { issues: [{ code: "no_rows" }] },
      ok: false,
    });
    expect(
      runUnzip({ table: { columns: ["a"], rows: [[1], [1, 2]] } }),
    ).toMatchObject({
      error: { issues: [{ code: "inconsistent_row_count" }] },
      ok: false,
    });
  });
});
