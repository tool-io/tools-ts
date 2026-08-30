import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, checksumTotalRowAppenderInputSchema, checksumTotalRowAppenderOutputSchema } from "./index.js";
describe("csv/checksum-total-row-appender", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, checksumTotalRowAppenderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, checksumTotalRowAppenderOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "item,amount",
      "delimiter": ",",
      "hasHeader": true,
      "columnIndices": [
        1
      ],
      "labelColumn": 0,
      "label": "Total"
    })).toEqual({ ok: true, output: {
      "csv": "item,amount\nTotal,0"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "a,1",
      "delimiter": ",",
      "hasHeader": false,
      "columnIndices": [
        1
      ],
      "labelColumn": 1,
      "label": "Total"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "labelColumn", code: "column_conflict" }] } });
  });

  it("keeps total-row output within CSV field and text limits", () => {
    expect(tool.execute({ csv: ",".repeat(9999), delimiter: ",", hasHeader: false, columnIndices: [], labelColumn: 0, label: "Total" })).toMatchObject({ ok: false, error: { issues: [{ field: "csv", code: "resource_limit" }] } });
    expect(tool.execute({ csv: "x".repeat(99998) + ",1", delimiter: ",", hasHeader: false, columnIndices: [1], labelColumn: 0, label: "Total" })).toMatchObject({ ok: false, error: { issues: [{ field: "label", code: "resource_limit" }] } });
  });
});
