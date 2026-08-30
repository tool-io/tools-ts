import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, lcmListInputSchema, lcmListOutputSchema } from "./index.js";

describe("math/lcm-list", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, lcmListInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, lcmListOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      values: ["9007199254740993", "2"],
    })).toEqual({ ok: true, output: {
      lcm: "18014398509481986",
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      values: ["0", "5"],
    })).toEqual({ ok: true, output: {
      lcm: "0",
    } });
    expect(tool.execute({
      values: ["-1"],
    })).toEqual({ ok: true, output: {
      lcm: "1",
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "invalid_type" }] } });
    expect(tool.execute({
      values: ["12", "-18", "30"],
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      values: [],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values", code: "out_of_range" }] } });
    expect(tool.execute({
      values: [2],
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "values.0", code: "invalid_type" }] } });
  });

});
