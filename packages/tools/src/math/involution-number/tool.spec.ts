import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, involutionNumberInputSchema, involutionNumberOutputSchema } from "./index.js";

describe("math/involution-number", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, involutionNumberInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, involutionNumberOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 4,
    })).toEqual({ ok: true, output: {
      value: "10",
    } });
    expect(tool.execute({
      n: 10,
    })).toEqual({ ok: true, output: {
      value: "9496",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      n: 1,
    })).toEqual({ ok: true, output: {
      value: "1",
    } });
    expect(tool.execute({
      n: 2,
    })).toEqual({ ok: true, output: {
      value: "2",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 6,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
