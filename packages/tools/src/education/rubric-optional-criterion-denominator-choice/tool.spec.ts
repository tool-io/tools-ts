import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("education/rubric-optional-criterion-denominator-choice", () => {
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
        requiredMaximum: 80,
        optionalMaximum: 20,
        earnedRequired: 60,
        earnedOptional: 10,
        includeOptional: false,
      }),
    ).toEqual({
      ok: true,
      output: { denominator: 80, countedEarned: 60, scoreFraction: 0.75 },
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
    "rejects nonfinite requiredMaximum",
    (value) =>
      expect(
        tool.execute({ ...example.input, requiredMaximum: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite optionalMaximum",
    (value) =>
      expect(
        tool.execute({ ...example.input, optionalMaximum: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite earnedRequired",
    (value) =>
      expect(tool.execute({ ...example.input, earnedRequired: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite earnedOptional",
    (value) =>
      expect(tool.execute({ ...example.input, earnedOptional: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { requiredMaximum: -1 },
    { optionalMaximum: -1 },
    { earnedRequired: -1 },
    { earnedOptional: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { requiredMaximum: -1 },
    { optionalMaximum: -1 },
    { earnedRequired: -1 },
    { earnedOptional: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("rejects an explicit domain boundary with stable field", () => {
    const input = {
      ...example.input,
      ...{ requiredMaximum: 0, earnedRequired: 0, includeOptional: false },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "requiredMaximum", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
