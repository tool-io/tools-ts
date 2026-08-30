import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, srcsetXDescriptorVsSizesWInputSchema, srcsetXDescriptorVsSizesWOutputSchema } from "./index.js";
describe("html/srcset-x-descriptor-vs-sizes-w", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, srcsetXDescriptorVsSizesWInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, srcsetXDescriptorVsSizesWOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "descriptor": "1.5x"
})).toEqual({ ok: true, output: {
  "kind": "density",
  "value": 1.5,
  "usesSizes": false,
  "valid": true
} });
    expect(tool.execute({
  "descriptor": "0x"
})).toEqual({ ok: true, output: {
  "kind": "invalid",
  "value": 0,
  "usesSizes": false,
  "valid": false
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "descriptor": ""
})).toEqual({ ok: true, output: {
  "kind": "density",
  "value": 1,
  "usesSizes": false,
  "valid": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "descriptor", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

  it("distinguishes conforming descriptors from tolerant parser input", () => {
    for (const descriptor of ["+2x", "1.x", "2X", "2x\n", "1e999x", "9007199254740992w"])
      expect(tool.execute({ descriptor })).toEqual({ ok: true, output: { kind: "invalid", value: 0, usesSizes: false, valid: false } });
    expect(tool.execute({ descriptor: ".5x" })).toEqual({ ok: true, output: { kind: "density", value: 0.5, usesSizes: false, valid: true } });
  });
});
