import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, imgAltPresenceCheckerInputSchema, imgAltPresenceCheckerOutputSchema } from "./index.js";
describe("html/img-alt-presence-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, imgAltPresenceCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, imgAltPresenceCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "hasAlt": true,
  "alt": ""
})).toEqual({ ok: true, output: {
  "present": true,
  "emptyAlternative": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "hasAlt": false,
  "alt": ""
})).toEqual({ ok: true, output: {
  "present": false,
  "emptyAlternative": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hasAlt", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
