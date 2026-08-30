import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, scriptDeferAsyncExecutionOrderTableInputSchema, scriptDeferAsyncExecutionOrderTableOutputSchema } from "./index.js";
describe("html/script-defer-async-execution-order-table", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, scriptDeferAsyncExecutionOrderTableInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, scriptDeferAsyncExecutionOrderTableOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "kind": "classic",
  "external": true,
  "async": true,
  "defer": true
})).toEqual({ ok: true, output: {
  "phase": "when-ready",
  "parserBlocking": false,
  "orderedWithDeferred": false
} });
    expect(tool.execute({
  "kind": "module",
  "external": false,
  "async": false,
  "defer": false
})).toEqual({ ok: true, output: {
  "phase": "after-parsing",
  "parserBlocking": false,
  "orderedWithDeferred": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "kind": "classic",
  "external": false,
  "async": true,
  "defer": true
})).toEqual({ ok: true, output: {
  "phase": "during-parsing",
  "parserBlocking": true,
  "orderedWithDeferred": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "kind", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
