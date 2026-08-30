import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, multilineQuotedCellLineCounterInputSchema, multilineQuotedCellLineCounterOutputSchema } from "./index.js";
describe("csv/multiline-quoted-cell-line-counter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, multilineQuotedCellLineCounterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, multilineQuotedCellLineCounterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "\"a\rb\"",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "cells": [
        {
          "record": 0,
          "column": 0,
          "lineCount": 2
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "\"\"",
      "delimiter": ","
    })).toEqual({ ok: true, output: {
      "cells": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
