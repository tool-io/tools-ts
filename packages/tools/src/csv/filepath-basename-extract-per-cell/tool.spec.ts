import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, filepathBasenameExtractPerCellInputSchema, filepathBasenameExtractPerCellOutputSchema } from "./index.js";
describe("csv/filepath-basename-extract-per-cell", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, filepathBasenameExtractPerCellInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, filepathBasenameExtractPerCellOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "values": [
        "C:\\data\\sales.csv",
        "C:\\"
      ],
      "style": "windows"
    })).toEqual({ ok: true, output: {
      "basenames": [
        "sales.csv",
        ""
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "values": [
        ""
      ],
      "style": "posix"
    })).toEqual({ ok: true, output: {
      "basenames": [
        ""
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("removes a Windows drive prefix from a drive-relative filename", () => {
    expect(tool.execute({ values: ["C:report.csv"], style: "windows" })).toEqual({ ok: true, output: { basenames: ["report.csv"] } });
  });
});
