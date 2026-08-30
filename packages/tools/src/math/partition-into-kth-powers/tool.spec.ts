import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, partitionIntoKthPowersInputSchema, partitionIntoKthPowersOutputSchema } from "./index.js";

describe("math/partition-into-kth-powers", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, partitionIntoKthPowersInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, partitionIntoKthPowersOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      total: 5,
      power: 2,
    })).toEqual({ ok: true, output: {
      value: "2",
    } });
    expect(tool.execute({
      total: 10,
      power: 3,
    })).toEqual({ ok: true, output: {
      value: "2",
    } });
    expect(tool.execute({
      total: 5,
      power: 1,
    })).toEqual({ ok: true, output: {
      value: "7",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      total: 0,
      power: 2,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      total: 1,
      power: 3,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      total: 2,
      power: 9007199254740991,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "total", code: "invalid_type" }] } });
    expect(tool.execute({
      total: 10,
      power: 2,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, total: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "total", code: "invalid_type" }] } });
    expect(tool.execute({
      total: 5,
      power: 0,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "power", code: "out_of_range" }] } });
  });

});
