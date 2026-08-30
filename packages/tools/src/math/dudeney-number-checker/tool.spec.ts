import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, dudeneyNumberCheckerInputSchema, dudeneyNumberCheckerOutputSchema } from "./index.js";

describe("math/dudeney-number-checker", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, dudeneyNumberCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, dudeneyNumberCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: "4913",
    })).toEqual({ ok: true, output: {
      isDudeney: true,
    } });
    expect(tool.execute({
      n: "5832",
    })).toEqual({ ok: true, output: {
      isDudeney: true,
    } });
    expect(tool.execute({
      n: "8",
    })).toEqual({ ok: true, output: {
      isDudeney: false,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({ n: "0" })).toEqual({
      ok: true,
      output: { isDudeney: true },
    });
    expect(tool.execute({
      n: "1",
    })).toEqual({ ok: true, output: {
      isDudeney: true,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: "512",
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: "01",
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_format" }] } });
  });

});
