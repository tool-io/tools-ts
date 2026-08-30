import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, figureFigcaptionPairingCheckerInputSchema, figureFigcaptionPairingCheckerOutputSchema } from "./index.js";
describe("html/figure-figcaption-pairing-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, figureFigcaptionPairingCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, figureFigcaptionPairingCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "children": [
    "p",
    "figcaption",
    "img"
  ]
})).toEqual({ ok: true, output: {
  "captionCount": 1,
  "captionIndex": 1,
  "validPlacement": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "children": []
})).toEqual({ ok: true, output: {
  "captionCount": 0,
  "captionIndex": -1,
  "validPlacement": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "children", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
