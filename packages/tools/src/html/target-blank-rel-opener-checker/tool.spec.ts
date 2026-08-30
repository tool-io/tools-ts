import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, targetBlankRelOpenerCheckerInputSchema, targetBlankRelOpenerCheckerOutputSchema } from "./index.js";
describe("html/target-blank-rel-opener-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, targetBlankRelOpenerCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, targetBlankRelOpenerCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "target": "_BLANK",
  "rel": ""
})).toEqual({ ok: true, output: {
  "blankTarget": true,
  "openerRequested": false,
  "referrerSuppressed": false
} });
    expect(tool.execute({
  "target": "_blank",
  "rel": "opener noreferrer"
})).toEqual({ ok: true, output: {
  "blankTarget": true,
  "openerRequested": false,
  "referrerSuppressed": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "target": "_self",
  "rel": "opener"
})).toEqual({ ok: true, output: {
  "blankTarget": false,
  "openerRequested": false,
  "referrerSuppressed": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "target", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("gives explicit noopener priority over opener", () => {
    expect(tool.execute({ target: "_blank", rel: "OPENER NOOPENER" })).toEqual({ ok: true, output: { blankTarget: true, openerRequested: false, referrerSuppressed: false } });
    expect(tool.execute({ target: " _blank", rel: "opener" })).toEqual({ ok: true, output: { blankTarget: false, openerRequested: false, referrerSuppressed: false } });
  });
});
