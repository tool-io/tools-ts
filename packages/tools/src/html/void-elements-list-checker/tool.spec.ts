import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, voidElementsListCheckerInputSchema, voidElementsListCheckerOutputSchema } from "./index.js";
describe("html/void-elements-list-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, voidElementsListCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, voidElementsListCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "names": [
    "param",
    "wbr",
    "input"
  ]
})).toEqual({ ok: true, output: {
  "isVoid": [
    false,
    true,
    true
  ],
  "voidCount": 2
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "names": []
})).toEqual({ ok: true, output: {
  "isVoid": [],
  "voidCount": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "names", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("rejects sparse arrays and bounded input excess", () => {
    expect(tool.execute({ names: Array<string>(1) })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "names.0", code: "invalid_type" }] } });
    expect(tool.execute({ names: Array<string>(10001).fill("br") })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "names", code: "resource_limit" }] } });
    expect(tool.execute({ names: ["div".repeat(3334)] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "names.0", code: "resource_limit" }] } });
  });
});
