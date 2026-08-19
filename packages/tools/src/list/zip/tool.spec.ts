import { describe, expect, it } from "vitest";
import { calculateZip, runZip, zipExample } from "./tool.js";
import { calculateUnzip, runUnzip, unzipExample } from "../unzip/tool.js";

describe("list zip tool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runZip(zipExample.input)).toEqual({
      ok: true,
      output: zipExample.output,
    });
  });

  it("zips three columns of mixed types", () => {
    const output = calculateZip({
      columns: { name: ["ada"], active: [true], score: [99] },
    });
    expect(output.table).toEqual({
      columns: ["name", "active", "score"],
      rows: [["ada", true, 99]],
    });
  });

  it("round-trips with the unzip tool", () => {
    const unzipped = calculateUnzip({
      table: calculateZip(zipExample.input).table,
    });
    expect(unzipped.columns).toEqual(zipExample.input.columns);
  });

  it("rejects empty input and mismatched lengths through execution", () => {
    expect(runZip({ columns: {} })).toMatchObject({
      error: { issues: [{ code: "no_columns" }] },
      ok: false,
    });
    expect(runZip({ columns: { a: [1, 2], b: [1] } })).toMatchObject({
      error: { issues: [{ code: "length_mismatch" }] },
      ok: false,
    });
    expect(runZip({ columns: { a: "nope" } })).toMatchObject({
      error: { issues: [{ code: "invalid_column" }] },
      ok: false,
    });
  });
});
