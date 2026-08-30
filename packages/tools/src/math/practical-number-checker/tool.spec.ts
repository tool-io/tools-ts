import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, practicalNumberCheckerInputSchema, practicalNumberCheckerOutputSchema } from "./index.js";

describe("math/practical-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, practicalNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, practicalNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 10,
    })).toEqual({ ok: true, output: {
      isPractical: false,
    } });
    expect(tool.execute({
      n: 12,
    })).toEqual({ ok: true, output: {
      isPractical: true,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      isPractical: true,
    } });
    expect(tool.execute({
      n: 2,
    })).toEqual({ ok: true, output: {
      isPractical: true,
    } });
    expect(tool.execute({
      n: 3,
    })).toEqual({ ok: true, output: {
      isPractical: false,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 30,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 0,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "out_of_range" }] } });
    expect(tool.execute({
      n: 1000000000001,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "resource_limit" }] } });
  });

});
