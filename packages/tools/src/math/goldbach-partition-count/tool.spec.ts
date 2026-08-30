import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, goldbachPartitionCountInputSchema, goldbachPartitionCountOutputSchema } from "./index.js";

describe("math/goldbach-partition-count", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, goldbachPartitionCountInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, goldbachPartitionCountOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 10,
    })).toEqual({ ok: true, output: {
      count: 2,
    } });
    expect(tool.execute({
      n: 12,
    })).toEqual({ ok: true, output: {
      count: 1,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 4,
    })).toEqual({ ok: true, output: {
      count: 1,
    } });
    expect(tool.execute({
      n: 6,
    })).toEqual({ ok: true, output: {
      count: 1,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 26,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 9,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_parity" }] } });
    expect(tool.execute({
      n: 2,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "out_of_range" }] } });
  });

});
