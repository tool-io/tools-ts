import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, viewportMetaWidthDeviceCheckerInputSchema, viewportMetaWidthDeviceCheckerOutputSchema } from "./index.js";
describe("html/viewport-meta-width-device-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, viewportMetaWidthDeviceCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, viewportMetaWidthDeviceCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "content": "width=900; WIDTH = DEVICE-WIDTH"
})).toEqual({ ok: true, output: {
  "hasDeviceWidth": true,
  "widthDirectiveCount": 2
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "content": ""
})).toEqual({ ok: true, output: {
  "hasDeviceWidth": false,
  "widthDirectiveCount": 0
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "content", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
