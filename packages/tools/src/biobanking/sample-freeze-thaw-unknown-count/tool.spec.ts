import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biobanking/sample-freeze-thaw-unknown-count", () => {
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
        knownEvents: 2,
        uncertainEvents: 1,
        upperKnown: false,
        suppliedUnobservedUpper: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        minimumEvents: 2,
        maximumEvents: 0,
        maximumKnown: false,
        uncertainRecords: 1,
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
    "rejects nonfinite knownEvents",
    (value) =>
      expect(tool.execute({ ...example.input, knownEvents: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite uncertainEvents",
    (value) =>
      expect(
        tool.execute({ ...example.input, uncertainEvents: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedUnobservedUpper",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedUnobservedUpper: value }).ok,
      ).toBe(false),
  );
  it.each([{ knownEvents: -1 }, { uncertainEvents: -1 }])(
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
  it.each([{ knownEvents: -1 }, { uncertainEvents: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 70 independent regressions", () => {
  it("keeps an unknown upper endpoint flagged", () => {
    expect(
      calculate({
        knownEvents: 3,
        uncertainEvents: 2,
        upperKnown: false,
        suppliedUnobservedUpper: 2,
      }),
    ).toEqual({
      minimumEvents: 3,
      maximumEvents: 0,
      maximumKnown: false,
      uncertainRecords: 2,
    });
    expect(
      tool.execute({
        knownEvents: 3,
        uncertainEvents: 2,
        upperKnown: false,
        suppliedUnobservedUpper: 2,
      }),
    ).toEqual({
      ok: true,
      output: {
        minimumEvents: 3,
        maximumEvents: 0,
        maximumKnown: false,
        uncertainRecords: 2,
      },
    });
  });
});
