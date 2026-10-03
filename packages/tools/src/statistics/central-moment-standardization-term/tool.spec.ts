import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("statistics/central-moment-standardization-term", () => {
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
    expect(
      tool.execute({ centralMoment: 12, standardDeviation: 2, order: 2 }),
    ).toEqual({ ok: true, output: { standardizedMoment: 3 } });
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite centralMoment",
    (value) =>
      expect(tool.execute({ ...example.input, centralMoment: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite standardDeviation",
    (value) =>
      expect(
        tool.execute({ ...example.input, standardDeviation: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite order", (value) =>
    expect(tool.execute({ ...example.input, order: value }).ok).toBe(false),
  );
  it.each([{ standardDeviation: 0 }, { order: 0 }, { order: 257 }])(
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
  it.each([{ standardDeviation: 0 }, { order: 0 }, { order: 257 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("avoids an overflowing variance-power denominator", () => {
    const output = calculate({
      centralMoment: 1e308,
      standardDeviation: 1e154,
      order: 4,
    });
    expect(output).toMatchObject({});
    expect(output.standardizedMoment / 1e-308).toBeCloseTo(1, 11);
    expect(
      tool.execute({
        centralMoment: 1e308,
        standardDeviation: 1e154,
        order: 4,
      }),
    ).toEqual({ ok: true, output });
  });
});
