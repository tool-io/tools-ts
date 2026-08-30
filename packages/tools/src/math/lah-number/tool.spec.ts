import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, lahNumberInputSchema, lahNumberOutputSchema } from "./index.js";

describe("math/lah-number", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, lahNumberInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, lahNumberOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 3,
      k: 2,
    })).toEqual({ ok: true, output: {
      value: "6",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
      k: 0,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      n: 4,
      k: 0,
    })).toEqual({ ok: true, output: {
      value: "0",
    } });
    expect(tool.execute({
      n: 3,
      k: 4,
    })).toEqual({ ok: true, output: {
      value: "0",
    } });
    expect(tool.execute({
      n: 4,
      k: 4,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 4,
      k: 2,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, n: NaN })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
