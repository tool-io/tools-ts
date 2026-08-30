import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, multinomialCoefficientInputSchema, multinomialCoefficientOutputSchema } from "./index.js";

describe("math/multinomial-coefficient", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, multinomialCoefficientInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, multinomialCoefficientOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      counts: [3, 3],
    })).toEqual({ ok: true, output: {
      value: "20",
    } });
    expect(tool.execute({
      counts: [1, 1, 1, 1],
    })).toEqual({ ok: true, output: {
      value: "24",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      counts: [],
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      counts: [0, 0],
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "counts", code: "invalid_type" }] } });
    expect(tool.execute({
      counts: [2, 3, 1],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      counts: [1001, 1000],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "counts", code: "resource_limit" }] } });
    expect(tool.execute({
      counts: [2, -1],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "counts.1", code: "out_of_range" }] } });
    expect(tool.execute({ counts: [2, NaN] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "counts.1", code: "invalid_type" }] } });
  });

});
