import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("orthopedics/orthopedic-sample-cross-section-inertia-term", () => {
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
        outerWidth: 4,
        outerHeight: 4,
        innerWidth: 0,
        innerHeight: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        area: 16,
        inertiaX: 21.333333333333332,
        inertiaY: 21.333333333333332,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite outerWidth", (value) =>
    expect(tool.execute({ ...example.input, outerWidth: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite outerHeight",
    (value) =>
      expect(tool.execute({ ...example.input, outerHeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite innerWidth", (value) =>
    expect(tool.execute({ ...example.input, innerWidth: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite innerHeight",
    (value) =>
      expect(tool.execute({ ...example.input, innerHeight: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { outerWidth: -1 },
    { outerHeight: -1 },
    { innerWidth: -1 },
    { innerHeight: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { outerWidth: -1 },
    { outerHeight: -1 },
    { innerWidth: -1 },
    { innerHeight: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 66 review regressions", () => {
  it("swaps principal inertias when width and height are exchanged", () => {
    expect(
      calculate({
        outerWidth: 6,
        outerHeight: 4,
        innerWidth: 4,
        innerHeight: 2,
      }),
    ).toEqual({
      area: 16,
      inertiaX: 29.333333333333332,
      inertiaY: 61.333333333333336,
    });
  });
});
