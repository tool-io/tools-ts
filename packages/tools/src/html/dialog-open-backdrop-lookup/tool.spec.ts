import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dialogOpenBackdropLookupInputSchema, dialogOpenBackdropLookupOutputSchema } from "./index.js";
describe("html/dialog-open-backdrop-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dialogOpenBackdropLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dialogOpenBackdropLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "state": "nonmodal"
})).toEqual({ ok: true, output: {
  "open": true,
  "modal": false,
  "backdropEligible": false,
  "blocksDocument": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "state": "closed"
})).toEqual({ ok: true, output: {
  "open": false,
  "modal": false,
  "backdropEligible": false,
  "blocksDocument": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "state", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
