import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("adult-education/adult-course-reentry-credit-balance", () => {
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
        priorCredits: 2,
        recognizedCredits: 0,
        expiredCredits: 3,
      }),
    ).toEqual({ ok: true, output: { closingBalance: -1 } });
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
    "rejects nonfinite priorCredits",
    (value) =>
      expect(tool.execute({ ...example.input, priorCredits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recognizedCredits",
    (value) =>
      expect(
        tool.execute({ ...example.input, recognizedCredits: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite expiredCredits",
    (value) =>
      expect(tool.execute({ ...example.input, expiredCredits: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { priorCredits: -1 },
    { recognizedCredits: -1 },
    { expiredCredits: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { priorCredits: -1 },
    { recognizedCredits: -1 },
    { expiredCredits: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ priorCredits: 0, recognizedCredits: 0, expiredCredits: 2 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { closingBalance: -2 },
    });
    expect(calculate(input)).toEqual({ closingBalance: -2 });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ priorCredits: 1.5, recognizedCredits: 0.5, expiredCredits: 0.25 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { closingBalance: 1.75 },
    });
    expect(calculate(input)).toEqual({ closingBalance: 1.75 });
  });
});
