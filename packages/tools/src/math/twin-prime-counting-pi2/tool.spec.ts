import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, twinPrimeCountingPi2InputSchema, twinPrimeCountingPi2OutputSchema } from "./index.js";

describe("math/twin-prime-counting-pi2", () => {
  it("executes the exact canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches the portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, twinPrimeCountingPi2InputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, twinPrimeCountingPi2OutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      n: 10,
    })).toEqual({ ok: true, output: {
      count: 2,
    } });
    expect(tool.execute({
      n: 17,
    })).toEqual({ ok: true, output: {
      count: 4,
    } });
  });
  it("handles mathematical boundaries", () => {
    expect(tool.execute({
      n: 0,
    })).toEqual({ ok: true, output: {
      count: 0,
    } });
    expect(tool.execute({
      n: 2,
    })).toEqual({ ok: true, output: {
      count: 0,
    } });
    expect(tool.execute({
      n: 3,
    })).toEqual({ ok: true, output: {
      count: 1,
    } });
    expect(tool.execute({
      n: 5,
    })).toEqual({ ok: true, output: {
      count: 2,
    } });
  });
  it("returns stable errors for malformed and unsupported input", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
    expect(tool.execute({
      n: 100,
      unexpected: 1,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      n: NaN,
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "n", code: "invalid_type" }] } });
  });

});
