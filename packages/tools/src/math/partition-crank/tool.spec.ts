import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, partitionCrankInputSchema, partitionCrankOutputSchema } from "./index.js";

describe("math/partition-crank", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, partitionCrankInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, partitionCrankOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      parts: [3, 3],
    })).toEqual({ ok: true, output: {
      crank: 3,
    } });
    expect(tool.execute({
      parts: [4, 2, 1],
    })).toEqual({ ok: true, output: {
      crank: 1,
    } });
    expect(tool.execute({
      parts: [1, 1, 1],
    })).toEqual({ ok: true, output: {
      crank: -3,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      parts: [],
    })).toEqual({ ok: true, output: {
      crank: 0,
    } });
    expect(tool.execute({
      parts: [1],
    })).toEqual({ ok: true, output: {
      crank: -1,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parts", code: "invalid_type" }] } });
    expect(tool.execute({
      parts: [3, 2, 1, 1],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      parts: [2, 3],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "parts.1", code: "invalid_partition" }] } });
  });

});
