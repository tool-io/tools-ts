import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, factorialTrailingZerosCountInputSchema, factorialTrailingZerosCountOutputSchema } from "./index.js";

describe("math/factorial-trailing-zeros-count", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, factorialTrailingZerosCountInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, factorialTrailingZerosCountOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "1000",
    })).toEqual({ ok: true, output: {
      zeros: "249",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: "0",
    })).toEqual({ ok: true, output: {
      zeros: "0",
    } });
    expect(tool.execute({
      n: "4",
    })).toEqual({ ok: true, output: {
      zeros: "0",
    } });
    expect(tool.execute({
      n: "25",
    })).toEqual({ ok: true, output: {
      zeros: "6",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "100",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: "-1",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_format" }] } });
    expect(tool.execute({
      n: "1.5",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_format" }] } });
  });

});
