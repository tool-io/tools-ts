import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, ariaLivePoliteAssertiveOffLookupInputSchema, ariaLivePoliteAssertiveOffLookupOutputSchema } from "./index.js";
describe("html/aria-live-polite-assertive-off-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, ariaLivePoliteAssertiveOffLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, ariaLivePoliteAssertiveOffLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "value": "polite"
})).toEqual({ ok: true, output: {
  "priority": "polite",
  "mayInterrupt": false
} });
    expect(tool.execute({
  "value": "off"
})).toEqual({ ok: true, output: {
  "priority": "focus-dependent",
  "mayInterrupt": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "value", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
