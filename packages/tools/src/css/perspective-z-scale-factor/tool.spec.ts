import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, perspectiveZScaleFactorInputSchema, perspectiveZScaleFactorOutputSchema } from "./index.js";
describe("css/perspective-z-scale-factor", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, perspectiveZScaleFactorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, perspectiveZScaleFactorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "perspective": 500,
      "z": -500
    })).toEqual({ ok: true, output: {
      "scale": 0.5,
      "usedPerspective": 500
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "perspective": 0.5,
      "z": 0.5
    })).toEqual({ ok: true, output: {
      "scale": 2,
      "usedPerspective": 1
    } });
    expect(tool.execute({
      "perspective": 1e+308,
      "z": -1e+308
    })).toEqual({ ok: true, output: {
      "scale": 0.5,
      "usedPerspective": 1e+308
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "perspective", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "perspective": 500,
      "z": 500
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "z", code: "viewer_plane" }] } });
    expect(tool.execute({
      "perspective": -1,
      "z": 0
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "perspective", code: "out_of_range" }] } });
  });

  it("applies the CSS used-value clamp to zero perspective", () => {
    expect(tool.execute({ perspective: 0, z: 0 })).toEqual({ ok: true, output: { scale: 1, usedPerspective: 1 } });
  });
});
