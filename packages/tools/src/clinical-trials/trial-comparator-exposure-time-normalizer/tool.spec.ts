import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("clinical-trials/trial-comparator-exposure-time-normalizer", () => {
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
      tool.execute({
        activeEvents: 6,
        comparatorEvents: 8,
        activePersonTime: 60,
        comparatorPersonTime: 80,
        referenceBase: 100,
      }),
    ).toEqual({
      ok: true,
      output: {
        activeRate: 10,
        comparatorRate: 10,
        rateDifference: 0,
        rateRatio: 1,
      },
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite activeEvents",
    (value) =>
      expect(tool.execute({ ...example.input, activeEvents: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite comparatorEvents",
    (value) =>
      expect(
        tool.execute({ ...example.input, comparatorEvents: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite activePersonTime",
    (value) =>
      expect(
        tool.execute({ ...example.input, activePersonTime: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite comparatorPersonTime",
    (value) =>
      expect(
        tool.execute({ ...example.input, comparatorPersonTime: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceBase",
    (value) =>
      expect(tool.execute({ ...example.input, referenceBase: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { activeEvents: -1 },
    { comparatorEvents: 0 },
    { activePersonTime: 0 },
    { comparatorPersonTime: 0 },
    { referenceBase: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { activeEvents: -1 },
    { comparatorEvents: 0 },
    { activePersonTime: 0 },
    { comparatorPersonTime: 0 },
    { referenceBase: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
