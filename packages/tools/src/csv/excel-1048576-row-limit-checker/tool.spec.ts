import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, excel1048576RowLimitCheckerInputSchema, excel1048576RowLimitCheckerOutputSchema } from "./index.js";
describe("csv/excel-1048576-row-limit-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, excel1048576RowLimitCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, excel1048576RowLimitCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "totalRows": 1048577
    })).toEqual({ ok: true, output: {
      "fits": false,
      "limit": 1048576,
      "remaining": 0,
      "excess": 1
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "totalRows": 1048576
    })).toEqual({ ok: true, output: {
      "fits": true,
      "limit": 1048576,
      "remaining": 0,
      "excess": 0
    } });
    expect(tool.execute({
      "totalRows": 0
    })).toEqual({ ok: true, output: {
      "fits": true,
      "limit": 1048576,
      "remaining": 1048576,
      "excess": 0
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "totalRows", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
