import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, fieldsetLegendA11yPairCheckerInputSchema, fieldsetLegendA11yPairCheckerOutputSchema } from "./index.js";
describe("html/fieldset-legend-a11y-pair-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, fieldsetLegendA11yPairCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fieldsetLegendA11yPairCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "children": [
    "input",
    "legend"
  ]
})).toEqual({ ok: true, output: {
  "legendCount": 1,
  "legendFirst": false,
  "validPlacement": false,
  "hasLegend": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "children": []
})).toEqual({ ok: true, output: {
  "legendCount": 0,
  "legendFirst": false,
  "validPlacement": true,
  "hasLegend": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "children", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
