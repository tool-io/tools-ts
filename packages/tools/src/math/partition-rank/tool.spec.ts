import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, partitionRankInputSchema, partitionRankOutputSchema } from "./index.js";

describe("math/partition-rank", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, partitionRankInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, partitionRankOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      parts: [5],
    })).toEqual({ ok: true, output: {
      rank: 4,
    } });
    expect(tool.execute({
      parts: [1, 1, 1],
    })).toEqual({ ok: true, output: {
      rank: -2,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      parts: [],
    })).toEqual({ ok: true, output: {
      rank: 0,
    } });
    expect(tool.execute({
      parts: [1],
    })).toEqual({ ok: true, output: {
      rank: 0,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parts", code: "invalid_type" }] } });
    expect(tool.execute({
      parts: [4, 2, 1],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      parts: [1, 2],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parts.1", code: "invalid_partition" }] } });
    expect(tool.execute({
      parts: [2, 0],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parts.1", code: "out_of_range" }] } });
  });

});
