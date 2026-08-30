import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, customElementDashNameRequirementInputSchema, customElementDashNameRequirementOutputSchema } from "./index.js";
describe("html/custom-element-dash-name-requirement", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, customElementDashNameRequirementInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, customElementDashNameRequirementOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "name": "math-\u03b1"
})).toEqual({ ok: true, output: {
  "valid": true,
  "containsDash": true,
  "reserved": false
} });
    expect(tool.execute({
  "name": "font-face"
})).toEqual({ ok: true, output: {
  "valid": false,
  "containsDash": true,
  "reserved": true
} });
    expect(tool.execute({
  "name": "Weather-panel"
})).toEqual({ ok: true, output: {
  "valid": false,
  "containsDash": true,
  "reserved": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "name": "panel"
})).toEqual({ ok: true, output: {
  "valid": false,
  "containsDash": false,
  "reserved": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "name", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("follows current DOM name rules and rejects forbidden separators", () => {
    expect(tool.execute({ name: "emoji-😀" })).toEqual({ ok: true, output: { valid: true, containsDash: true, reserved: false } });
    expect(tool.execute({ name: "x-a=b" })).toEqual({ ok: true, output: { valid: true, containsDash: true, reserved: false } });
    expect(tool.execute({ name: "x-a/b" })).toEqual({ ok: true, output: { valid: false, containsDash: true, reserved: false } });
  });
});
