import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, gridRepeatCountFromGapWidthInputSchema, gridRepeatCountFromGapWidthOutputSchema } from "./index.js";
describe("css/grid-repeat-count-from-gap-width", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, gridRepeatCountFromGapWidthInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, gridRepeatCountFromGapWidthOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "containerWidth": 640,
      "trackWidth": 200,
      "gap": 20
    })).toEqual({ ok: true, output: {
      "fitCount": 3,
      "repeatCount": 3,
      "oneTrackOverflows": false
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "containerWidth": 190,
      "trackWidth": 200,
      "gap": 20
    })).toEqual({ ok: true, output: {
      "fitCount": 0,
      "repeatCount": 1,
      "oneTrackOverflows": true
    } });
    expect(tool.execute({
      "containerWidth": 0,
      "trackWidth": 200,
      "gap": 0
    })).toEqual({ ok: true, output: {
      "fitCount": 0,
      "repeatCount": 1,
      "oneTrackOverflows": true
    } });
    expect(tool.execute({
      "containerWidth": 1e+308,
      "trackWidth": 1e+308,
      "gap": 1e+308
    })).toEqual({ ok: true, output: {
      "fitCount": 1,
      "repeatCount": 1,
      "oneTrackOverflows": false
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "containerWidth", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "containerWidth": 100,
      "trackWidth": 0,
      "gap": 5
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "trackWidth", code: "positive_width" }] } });
    expect(tool.execute({ ...example.input, containerWidth: Infinity })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "containerWidth", code: "invalid_type" }] } });
  });

});
