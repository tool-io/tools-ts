import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, headerDedupeSuffixCounterInputSchema, headerDedupeSuffixCounterOutputSchema } from "./index.js";
describe("csv/header-dedupe-suffix-counter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, headerDedupeSuffixCounterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, headerDedupeSuffixCounterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "headers": [
        "a",
        "a",
        "a",
        "A"
      ]
    })).toEqual({ ok: true, output: {
      "headers": [
        "a",
        "a_2",
        "a_3",
        "A"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "headers": []
    })).toEqual({ ok: true, output: {
      "headers": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "headers", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("is idempotent and produces unique labels", () => {
    const result = tool.execute({ headers: ["id", "id", "id_2", "id"] });
    if (!result.ok) throw new Error("Expected deduplicated headers.");
    expect(new Set(result.output.headers).size).toBe(result.output.headers.length);
    expect(tool.execute(result.output)).toEqual(result);
  });
});
