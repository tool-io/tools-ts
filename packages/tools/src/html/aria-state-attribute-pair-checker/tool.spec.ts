import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, ariaStateAttributePairCheckerInputSchema, ariaStateAttributePairCheckerOutputSchema } from "./index.js";
describe("html/aria-state-attribute-pair-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, ariaStateAttributePairCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, ariaStateAttributePairCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "attribute": "aria-current",
  "value": "custom"
})).toEqual({ ok: true, output: {
  "knownState": true,
  "definedValue": false
} });
    expect(tool.execute({
  "attribute": "toString",
  "value": "true"
})).toEqual({ ok: true, output: {
  "knownState": false,
  "definedValue": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "attribute": "aria-hidden",
  "value": "TRUE"
})).toEqual({ ok: true, output: {
  "knownState": true,
  "definedValue": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "attribute", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
