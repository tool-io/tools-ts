import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pediatrics/pediatric-visit-parent-child-time-split", () => {
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
        visitMinutes: 40,
        childOnlyMinutes: 5,
        parentOnlyMinutes: 10,
        sharedMinutes: 20,
      }),
    ).toEqual({
      ok: true,
      output: {
        contactMinutes: 35,
        unallocatedMinutes: 5,
        childContact: 25,
        parentContact: 30,
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
    "rejects nonfinite visitMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, visitMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite childOnlyMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, childOnlyMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite parentOnlyMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, parentOnlyMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sharedMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, sharedMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { visitMinutes: -1 },
    { childOnlyMinutes: -1 },
    { parentOnlyMinutes: -1 },
    { sharedMinutes: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { visitMinutes: -1 },
    { childOnlyMinutes: -1 },
    { parentOnlyMinutes: -1 },
    { sharedMinutes: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
