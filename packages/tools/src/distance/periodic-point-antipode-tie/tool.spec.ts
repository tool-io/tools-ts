import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("distance/periodic-point-antipode-tie", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(tool.execute({ first: 9, second: 1, period: 10 })).toEqual({
      ok: true,
      output: { distance: 2, antipodal: false },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite first", (value) =>
    expect(tool.execute({ ...example.input, first: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite second", (value) =>
    expect(tool.execute({ ...example.input, second: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite period", (value) =>
    expect(tool.execute({ ...example.input, period: value }).ok).toBe(false),
  );
  it.each([{ period: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ period: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("modular precision regressions", () => {
  it("retains a tiny relative distance on a huge period", () => {
    expect(calculate({ first: 0, second: 1, period: 1e300 })).toEqual({
      distance: 1,
      antipodal: false,
    });
    expect(tool.execute({ first: 0, second: 1, period: 1e300 })).toEqual({
      ok: true,
      output: { distance: 1, antipodal: false },
    });
  });
  it("reduces endpoints when the unreduced difference overflows", () => {
    expect(calculate({ first: -1e308, second: 1e308, period: 10 })).toEqual({
      distance: 2,
      antipodal: false,
    });
    expect(tool.execute({ first: -1e308, second: 1e308, period: 10 })).toEqual({
      ok: true,
      output: { distance: 2, antipodal: false },
    });
  });
});
